<template>
  <div class="row">
    <div class="row">
      <div v-if="authenticated" class="col-md-12">
        <h4>You are logged in!</h4>
      </div>
      <div v-else class="col-md-12">
        <h4>You are not logged in! Please <a @click="auth.login()">Log In</a> to continue.</h4>
      </div>
    </div>
    <div class="row alert alert-info" v-if="apiError">
      <div class="col-md-12">
        {{ apiError }}
      </div>
    </div>
    <div class="row">
      <div class="col-md-2">
        <button
          class="btn btn-primary btn-margin"
          @click="getPublic()">
          Public Request
        </button>
      </div>
      <div class="col-md-10">
        <pre>{{ publicResponse }}</pre>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2">
        <button
          class="btn btn-primary btn-margin"
          @click="getPrivate()">
          Private Request
        </button>
      </div>
      <div class="col-md-10">
        <pre>{{ privateResponse }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
  import ApiService from './../api/ApiService'

  const api = new ApiService()

  const { getPublic, getPrivate, publicResponse, privateResponse, apiError, apiNotifier } = api

  export default {
    name: 'index',
    props: ['auth', 'authenticated'],
    data () {
      apiNotifier.on('apiService', value => {
        this.publicResponse = value.publicResponse
        this.privateResponse = value.privateResponse
        this.apiError = value.apiError
      })
      return {
        publicResponse,
        privateResponse,
        apiError
      }
    },
    methods: {
      getPublic,
      getPrivate
    }
  }
</script>

<style>
  a {
    cursor: pointer;
  }
  pre {
    min-height: 3em;
  }
  pre.token {
    white-space: pre-wrap;      /* CSS3 */
    white-space: -moz-pre-wrap; /* Firefox */
    white-space: -pre-wrap;     /* Opera <7 */
    white-space: -o-pre-wrap;   /* Opera 7 */
    word-wrap: break-word;
  }
  .header {
    color: #F00;
  }
  .payload {
    color: #F0F;
  }
  .signature {
    color: #0BF;
  }
  .header-border {
    border-color: #F00;
  }
  .payload-border {
    border-color: #F0F;
  }
  .signature-border {
    border-color: #0BF;
  }
</style>

