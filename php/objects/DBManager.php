<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/objects/core.php';
error_reporting(E_ERROR | E_PARSE);

class DBManager
{
    public string $error_msg = '';
    private ?string $host = null;
    private ?string $db_name = null;
    private ?string $username = null;
    private ?string $password = null;
    private ?PDO $conn = null;
    private string $BREAKDOWNS_TABLE = "\"s264434\".\"Breakdowns\"";
    private string $BREAKDOWN_SOLUTIONS_TABLE = "\"s264434\".\"BreakdownSolutions\"";
    private string $SPACESHIPS_TABLE = "\"s264434\".\"Spaceships\"";
    private string $DETECTORS_TABLE = "\"s264434\".\"Detectors\"";
    private string $DEVICES_TABLE = "\"s264434\".\"Devices\"";
    private string $PLANETS_TABLE = "\"s264434\".\"Planets\"";
    private string $SPACESHIPS_DEVICES_TABLE = "\"s264434\".\"Spaceships_Devices\"";
    private string $MANUFACTURES_TABLE = "\"s264434\".\"Manufactures\"";


    public function __construct()
    {
        $server = read_config();
        $this->host = $server["host"];
        $this->db_name = $server["database"];
        $this->username = $server["user"];
        $this->password = $server["password"];

    }

    function connect(): bool
    {
        $this->error_msg = '';
        try {
            $dsn = 'pgsql:host=' . $this->host
                . ';dbname=' . $this->db_name
                . ';';
            $this->conn = new PDO($dsn, $this->username, $this->password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            return true;

        } catch (PDOException $exception) {
            $this->error_msg = $exception->getMessage();
            return false;
        }
    }

    function get_breakdowns(): ?array
    {
        try {
            $query = "select B.id as id,
                            (select extract(epoch from B.date)*1000 as date),
                            B.is_solved as isSolved,
                            S.name as spaceship,
                            B.description as description,
                            D.description as detector,
                            Dev.model_name as device,
                            BS.description as solutionDescription,
                            (select last_spaceship_flight(S.id))
                        from {$this->BREAKDOWNS_TABLE} as B
                        left join {$this->BREAKDOWN_SOLUTIONS_TABLE} BS on B.id = BS.id_breakdown
                        left join {$this->SPACESHIPS_TABLE} S on S.id = B.id_spaceship
                        left join {$this->DETECTORS_TABLE} D on BS.id_detector = D.id
                        left join {$this->DEVICES_TABLE} Dev on BS.id_device = Dev.id
                                order by B.id desc";
            $stmt = $this->conn->prepare($query);

            if ($stmt->execute()) {
                $result_set = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $stmt->closeCursor();
                foreach ($result_set as &$r) {
                    $r['date'] = intval($r['date']);
                    $r['id'] = intval($r['id']);
                    $r['detector'] = is_null($r['detector']) ? null : $r['detector'];
                    $r['device'] = is_null($r['device']) ? null : $r['device'];
                    $r['isSolved'] = $r['issolved'];
                    $r['solutionDescription'] = $r['solutiondescription'];
                    unset($r['solutiondescription']);
                    unset($r['issolved']);
                    $last_flight = explode(",", substr($r['last_spaceship_flight'], 1, -1));
                    $r['planetFrom'] = $last_flight[1];
                    $r['planetTo'] = $last_flight[3];
                    $r['dateFrom'] = strtotime(substr($last_flight[4], 1, -1)) * 1000;
                    $r['dateTo'] = strtotime(substr($last_flight[5], 1, -1)) * 1000;
                    unset($r['last_spaceship_flight']);
                }
                return $result_set;
            } else {
                $this->error_msg = $stmt->errorInfo()[1] ? $stmt->errorInfo()[1] : $this->conn->errorInfo();
                $stmt->closeCursor();
                return null;
            }
        } catch (PDOException $e) {
            $this->error_msg = $e->getMessage();
            return null;
        }
    }

    function get_spaceships(): ?array
    {
        try {
            $query = "select S.id,
                            S.name,
                            P.name as madeAtPlanet,
                            P2.name as currentPlanet,
                            P3.name as homePlanet,
                            array (select id_device from {$this->SPACESHIPS_DEVICES_TABLE} as SP  
                                    join {$this->DEVICES_TABLE} D on D.id = SP.id_device where SP.id_spaceship = S.id
                                )
                            from {$this->SPACESHIPS_TABLE} as S
                            left join {$this->MANUFACTURES_TABLE} M on M.id = S.id_manufacture
                            left join {$this->PLANETS_TABLE} P on P.id = M.id_planet
                            left join {$this->PLANETS_TABLE} P2 on P2.id = S.id_current_planet
                            left join {$this->PLANETS_TABLE} P3 on P3.id = S.id_home_planet
                                order by S.name;";
            $stmt = $this->conn->prepare($query);

            if ($stmt->execute()) {
                $result_set = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result_set as &$r) {
                    $r['id'] = intval($r['id']);
                    $devices_id = explode(',', substr($r['array'], 1, -1));
                    foreach ($devices_id as &$dev_id) {
                        $dev_id = intval($dev_id);
                    }
                    $r['devicesId'] = $devices_id;
                    $r['madeAtPlanet'] = $r['madeatplanet'];
                    $r['currentPlanet'] = $r['currentplanet'];
                    $r['homePlanet'] = $r['homeplanet'];

                    unset($r['array']);
                    unset($r['madeatplanet']);
                    unset($r['currentplanet']);
                    unset($r['homeplanet']);
                }
                return $result_set;
            } else {
                $this->error_msg = $stmt->errorInfo()[1] ? $stmt->errorInfo()[1] : $this->conn->errorInfo();
                $stmt->closeCursor();
                return null;
            }
        } catch (PDOException $e) {
            $this->error_msg = $e->getMessage();
            return null;
        }
    }
    function get_planets(): ?array
    {
        try {
            $query = "select id, name from {$this->PLANETS_TABLE} order by name";
            $stmt = $this->conn->prepare($query);

            if ($stmt->execute()) {
                $result_set = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result_set as &$r) {
                    $r['id'] = intval($r['id']);
                }
                return $result_set;
            } else {
                $this->error_msg = $stmt->errorInfo()[1] ? $stmt->errorInfo()[1] : $this->conn->errorInfo();
                $stmt->closeCursor();
                return null;
            }
        } catch (PDOException $e) {
            $this->error_msg = $e->getMessage();
            return null;
        }
    }
    function add_breakdown($spaceship_id, $date, $description): ?array
    {
        try {
            $query = "insert into {$this->BREAKDOWNS_TABLE}
            (id_spaceship, date, description)
            VALUES(:spaceship_id, to_timestamp(:date), :description)";
            $stmt = $this->conn->prepare($query);
            $breakdown_id = ($stmt->execute([
                'spaceship_id' => $spaceship_id,
                'date' => $date,
                'description' => $description,
            ])) ? intval($this->conn->lastInsertId()) : null;
            if (!is_null($breakdown_id)) {

                $result_set = $this->get_last_flight($spaceship_id);
                if(is_null($result_set)) return null;
                else $result_set['id'] = $breakdown_id;
                return $result_set;
            } else {
                $this->error_msg = $stmt->errorInfo()[1] ? $stmt->errorInfo()[1] : $this->conn->errorInfo();
                $stmt->closeCursor();
                return null;
            }
        } catch (PDOException $e) {
            $this->error_msg = $e->getMessage();
            return null;
        }
    }
    function  get_last_flight($spaceship_id): ?array
    {
        try {
            $query = "select name_planet_from, 
                            name_planet_to, 
                            date_start, 
                            date_end 
                        from last_spaceship_flight(:spaceship_id);";
            $stmt = $this->conn->prepare($query);
            if ($stmt->execute(['spaceship_id' => $spaceship_id])) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $result_new = array();
                $result_new['dateFrom'] = strtotime(substr($result[0]['date_start'], 1, -1))*1000;
                $result_new['dateTo'] = strtotime(substr($result[0]['date_end'], 1, -1))*1000;
                $result_new['planetFrom'] = $result[0]['name_planet_from'];
                $result_new['planetTo'] = $result[0]['name_planet_to'];
                return $result_new;
            } else {
                $this->error_msg = $stmt->errorInfo()[1] ? $stmt->errorInfo()[1] : $this->conn->errorInfo();
                $stmt->closeCursor();
                return null;
            }
        } catch (PDOException $e) {
            $this->error_msg = $e->getMessage();
            return null;
        }
    }
    function  get_devices_and_detectors(): ?array
    {
        try {
            $query = "select array_agg(Det.id) as detectors_id, 
                            array_agg(Det.description) as detectors_description,
                            Dev.id as id,
                            Dev.model_name as name,
                            Dev.model_description as description
                        from {$this->DETECTORS_TABLE} as Det
                        left join {$this->DEVICES_TABLE} Dev on Dev.id = Det.id_device
                        group by Dev.id;";
            $stmt = $this->conn->prepare($query);
            if ($stmt->execute()) {
                $result_set = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result_set as &$r) {
                    $r['id'] = intval($r['id']);
                    $r['detectors_description'] = explode(',', substr($r['detectors_description'], 1, -1));
                    $r['detectors_id'] = explode(',', substr($r['detectors_id'], 1, -1));
                    $count = 0;

                    foreach ($r['detectors_description'] as &$detector) {
                        $r['detectors'][] = array(
                            'description' => substr($detector, 1, -1),
                            'id' => intval($r['detectors_id'][$count])
                        );
                        $count++;
                    }
                    unset($r['detectors_description']);
                    unset($r['detectors_id']);
                }
                return $result_set;
            } else {
                $this->error_msg = $stmt->errorInfo()[1] ? $stmt->errorInfo()[1] : $this->conn->errorInfo();
                $stmt->closeCursor();
                return null;
            }
        } catch (PDOException $e) {
            $this->error_msg = $e->getMessage();
            return null;
        }
    }

    function add_solution($breakdown_id, $device_id, $detector_id, $description): ?bool
    {
        try {
            $query = "insert into {$this->BREAKDOWN_SOLUTIONS_TABLE}
                        (id_breakdown, id_device, id_detector, description)
                        VALUES(:id_breakdown, :id_device, :id_detector, :description)";
            $stmt = $this->conn->prepare($query);
            if($stmt->execute([
                'id_breakdown' => $breakdown_id,
                'id_device' => $device_id,
                'id_detector' => $detector_id,
                'description' => $description,
            ])) {
                $stmt->closeCursor();
                return true;
            }else {
                $this->error_msg = $stmt->errorInfo()[1] ? $stmt->errorInfo()[1] : $this->conn->errorInfo();
                $stmt->closeCursor();
                return null;
            }
        } catch (PDOException $e) {
            $this->error_msg = $e->getMessage();
            return null;
        }
    }
}