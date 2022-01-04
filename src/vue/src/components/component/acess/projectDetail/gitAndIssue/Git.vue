<template>
  <div class="Repo">
    <h1>Project Repository</h1>
    <div class="nodeTree">
      <h1>Document List</h1>
      <div class="repoContent" v-if="this.repoState">
        <Tree
            :search-text="searchText"
            :use-icon="true"
            @nodeExpanded="onUpdate"
            :nodes="data"
        />
      </div>
      <div class="repoContent" v-else>
        <div class="git-text-wrap">
          <input type="text" class="repoInputText" @keyup.enter="setRepoAdd"
                 placeholder="UserName/Repository를 입력해주세요. " size="30">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import {ref} from 'vue';
import Tree from 'vue3-tree'
import "vue3-tree/dist/style.css";
import moment from "moment" // eslint-disable-line no-unused-vars
import dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.VUE_APP_API_KEY

export default {
  components: {
    Tree,
  },
  data() {
    return {
      data: ref([]),
      searchText: ref(''),
      encodedData: '',
      errorFileNames: ['package-lock.json', '.DS_Store'],
      repoState: false,
      tempAdd: '',
      prjctIdx: sessionStorage.getItem('project'),
      token: sessionStorage.getItem('token'),
    }
  },
  mounted() {
    this.sendTokenInfo()
    this.getApiKey()
    this.getIssueList()
  },
  computed: {
    ...mapState({})
  },
  methods: {
    ...mapMutations({
      setDecodeData: 'git/setDecodeData',
      setSelectedFileName: 'git/setSelectedFileName',
      setIssueDate: 'git/setIssueDate',
      setSelectedFileSize: 'git/setSelectedFileSize'
    }),
    ...mapActions({
      getMemInfo: 'git/getMemInfo',
    }),
    sendTokenInfo() {
      this.getMemInfo(this.token)
    },

    onUpdate(e) {
      if (e.type === 'file') {
        this.sendContent(e)
        return
      }

      this.axios.get(`${e.url}`, {
        headers: {
          Authorization: `token ${API_KEY}`
        }
      })
          .then(res => {
            for (let i of res.data) {

              if (i.name === 'package-lock.json') continue
              if (i.name === '.DS_Store') continue
              if (i.name === 'node_modules') continue
              if (i.name === 'favicon.ico') continue

              const a = {
                idx: i.sha,
                label: i.name,
                type: i.type,
                url: i.url,
                nodes: [],
                content: null,
              }
              if (i.type === 'file') {
                a.nodes = null
                a.content = i.content
              }
              e.nodes.push(a)
            }
          })
    },

    sendContent(e) {
      this.axios.get(`${e.url}`, {
        headers: {
          Authorization: `token ${API_KEY}`
        }
      })
          .then(res => {
            this.encodedData = res.data.content
            this.decodeData()
            this.setSelectedFileName(res.data.name)
            this.setSelectedFileSize(res.data.size)
          })
    },
    setRepoAdd(e) {
      if (e.key === 'Enter') {
        const input = document.querySelector('.repoInputText').value
        const temp = `https://api.github.com/repos/${input}/contents`
        this.getFileList(temp, true)
      }
    },
    getFileList(r, flag) {
      const add = r
      this.tempAdd = add
      this.axios.get(`${add}`, {
        headers: {
          Authorization: `token ${API_KEY}`
        }
      })
          .then(res => {
            this.repoState = true
            for (let i of res.data) {

              // 403 error 방지
              if (i.name === 'package-lock.json') continue
              if (i.name === 'node_modules') continue
              if (i.name === '.DS_Store') continue
              if (i.name === 'favicon.ico') continue

              const array = {
                idx: i.sha,
                label: i.name,
                type: i.type,
                url: i.url,
                nodes: [],
                content: null,
              }
              if (i.type === 'file') {
                array.nodes = null
                array.content = i.content
              }
              this.data.push(array)
            }// for i of
            if (flag) this.insertRepoAdd()
          })
          .catch(() => {
                this.repoState = false
                const placeholder = document.querySelector('.repoInputText')
                placeholder.value = ''
                placeholder.placeholder = 'ex) Juwon-Yun/kanboo '
              }
          )
    },
    getIssueList() {
      const url = '/gitAndIssue/getAllList'
      const prjctIdx = this.prjctIdx
      this.axios.get(url, {
        params: {
          prjctIdx: prjctIdx,
        }
      })
          .then((r) => {
            for (let i = 0; i < r.data.length; i++) {
              r.data[i].issueDate = r.data[i].issueDate.replace('T', ' ')
              r.data[i].issueDate = moment(r.data[i].issueDate).format('LLL')
            }
            this.setIssueDate(r.data)
          })
    },
    decodeData() {
      this.setDecodeData(decodeURIComponent(escape(window.atob(this.encodedData))))
    },
    getApiKey() {
      const url = 'gitAndIssue/getAdd'
      const prjctIdx = this.prjctIdx

      this.axios.post(url, null, {
        params: {
          'project.prjctIdx': prjctIdx,
        }
      })
          .then(r => {
            if (r.data.address !== null || r.data.address !== '') {
              this.repoState = true;
              this.getFileList(r.data.address)
            }
          })
          .catch(
              this.repoState = false
          )
    },
    insertRepoAdd() {
      const url = 'gitAndIssue/insertRepo'

      this.axios.post(url, null, {
        params: {
          'project.prjctIdx': sessionStorage.getItem("project"),
          gitRepo: this.tempAdd,
        }
      })
    },
  },
}

</script>

<style scoped>
.Repo > h1:nth-child(1) {
  margin-bottom: 3px;
  color: #eee;
  font-size: 21px;
}

.nodeTree {
  height: 21vh;
  background-color: #2C2F3B;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border-radius: 5px;
}

.nodeTree::-webkit-scrollbar {
  display: none;
}

.nodeTree > h1 {
  padding-bottom: 5px;
  color: #eee;
}

.repoContent {
  color: #eee;
  height: 100%;
}

.tree-row-item {
  padding: 0;
}

.tree-list {
  gap: 5px;
}

.repoContent > div > * {
  color: #eee;
  background-color: #2C2F3B;
  border: none;
  outline: none;
}

.repoContent > div > *:focus {
  color: #eee;
  border: none;
  outline: none;
}

.git-text-wrap {
  display: flex;
  height: 100%;
  justify-content: center;
  align-content: center;
  position: initial;
}
</style>