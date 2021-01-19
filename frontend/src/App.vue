<template>
 <Header/>
 <router-view/>
</template>

<script>
import Header from "@/components/Header";

export default {
 components: {Header},
}
</script>

<style lang="scss">
.block-title {
 text-align: left;
 font-weight: bold;
 font-size: 1.8rem;
 margin-top: 20px;
 margin-bottom: 5px;
}

.green-block {
 border: 3px solid #42b983;
 background-color: #f3f5f7;
 border-radius: 10px;
 padding: 10px;
}

.wrapper {
 margin: auto 30px;
}

.block {
 max-width: 1000px;
 margin: auto;
}

#app {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 text-align: center;
 color: #2c3e50;
 padding: 50px 0 10px 0;
 margin: auto 30px;
}

.pretty-input {
 border-radius: 7px;
 background-color: #42b983;
 border: 2px solid #fff;
 color: #fff;
 -webkit-transition: all .2s cubic-bezier(.6, 0, .4, 1);
 transition: all .3s cubic-bezier(.6, 0, .4, 1);
}

.pretty-input:hover, .pretty-input:focus, .pretty-input-focus {
 background: #fff !important;
 color: #000 !important;
 border-color: #42b983 !important;
}

.clickable:hover, .clickable:focus {
 cursor: pointer !important;
}
</style>