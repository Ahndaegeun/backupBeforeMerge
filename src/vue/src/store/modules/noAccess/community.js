import axios from 'axios'

const community = {
    namespaced: true,

    state: {
        boardList: [],
        numberOfArticle: 0,
        articlesOnView: 0,
        content: '',
        updateCheck: false,
        selected: 'All',
        key: '',
        codeDetail : 7,
        axiosState : false,
        isOpen : false,
        signMember: {},
        updateCheckingForReal : false,
    },

    mutations: {
        changeUpdateCheckingForReal(state){
            state.updateCheckingForReal = !state.updateCheckingForReal
        },

        changeWriteIsOpen(state){
            state.isOpen = !state.isOpen
        },

        changeCodeDetail(state, payload){
            state.codeDetail = payload
        },

        pushToBoardList(state, payload) {
            payload["열렸니"] = false
            payload["수정했니"] = false
            payload["commentList"] = []
            payload["commentsOnView"] = 0
            payload.isModify = true
            payload.insertComment = ''
            state.boardList.push(payload)
        },

        unshiftToBoardList(state, payload){
            payload["열렸니"] = false
            payload["수정했니"] = false
            payload["commentList"] = []
            payload["commentsOnView"] = 0
            payload.isModify = true
            payload.insertComment = ''
            state.boardList.unshift(payload)
            state.articlesOnView++
        },

        unshiftToCommentList(state, payload){
            payload
        },

        // changeIsLike(state, payload){
        //     payload.isLike = !payload.isLike
        // },

        deleteBoards(state){
            state.articlesOnView--
            state.numberOfArticle--
        },

        increaseNumOfArticleAfterInsert(state){
            state.numberOfArticle++
        },

        decreaseNumOfArticleAfterInsert(state){
            state.numberOfArticle--
        },

        setNumberOfArticle(state, payload) {
            state.numberOfArticle = payload
        },

        setArticlesOnView(state, payload) {
            state.articlesOnView += payload
        },

        addingToArticlesOnView(state, payload) {
            state.articlesOnView += payload
        },

        pushToComment(state, item) {
            if (item._board.commentList.length !== 0 || item._board.totalComments === 0) {
                return
            }
            item._board.commentList.push(...item._comment)
            item._board.commentsOnView = item._comment.length;
        },

        //---------------게시글 관련 ------------------
        changeIsOpen(state, payload) {
            payload.열렸니 = !payload.열렸니
        },

        changeIsUpdate(state, payload) {
            payload.수정했니 = !payload.수정했니
        },
        //--------------------------------------------

        // 해당 게시물 댓글 리스트에 댓글 추가
        addingToCommentList(state, payload) {
            payload.board.commentList.push(...payload.commentList)
        },

        //----------------댓글 관련!!!-------------------
        changeCommentsIsOpen(state, payload) {
            payload.isOpen = !payload.isOpen
        },

        changeCommentsIsUpdate(state, payload) {
            payload.isUpdate = !payload.isUpdate
        },

        changeIsFinish(state, payload) {
            payload.isFinish = !payload.isFinish
        },

        changeIsModify(state, payload) {
            payload.isModify = !payload.isModify
        },

        //-------------------------------------------
        changeBoardIsModify(state, payload) {
            payload.isModify = !payload.isModify
        },
        changeUpdateCheck(state) {
            state.updateCheck = !state.updateCheck
        },

        getSelectedAndKey(state, payload) {
            state.key = payload.key
            state.selected = payload.selected
        },

        // 카테고리 변경시 데이터 초기화
        resetData(state) {
            state.boardList = []
            state.articlesOnView = 0
        },

        boardListNullPush(state, item) {
            state.boardList.push(item)
        },

        setAxiosState(state, stat) {
            state.axiosState = stat
        },

        setSignMember(state, item) {
            state.signMember = item
        },

        resetBoardList(state) {
            state.boardList = []
        }
    },

    actions: {
        getBoardList(context, position) {
            let detail
            if(position === 'qna') {
                detail = 8
            } else if(position === 'free') {
                detail = 7
            } else if(position === 'board'){
                detail = 9
            } else {
                detail = context.state.codeDetail
            }
            let token = 'none'
            let projectIdx = 0

            if(sessionStorage.getItem("token") !== null){
                token = sessionStorage.getItem("token")
            }
            if(sessionStorage.getItem("project") !== null){
                projectIdx = sessionStorage.getItem("project")
            }

            axios.get('/boardTest', {
                    params: {
                        selected: context.state.selected,
                        key: context.state.key,
                        articleOnvView: context.state.articlesOnView,
                        codeDetail: detail,
                        token : token,
                        projectIdx : projectIdx
                    }
                }
            )
                .then(e => {
                    const member = e.data.member
                    const boardList = e.data.boardList

                    if(boardList.length === 0) {
                        const obj = {
                            isNull: true,
                            content: '해당하는 게시물이 없습니다.'
                        }
                        context.commit('boardListNullPush', obj)
                        context.commit("setSignMember", member)
                        return
                    }
                    for (let item of boardList) {
                        context.commit('pushToBoardList', item)
                    }
                    context.commit('setArticlesOnView', boardList.length)
                    context.commit("setSignMember", member)
                })
        },

        getBoardNum(context, position) {
            let detail
            if(position === 'qna') {
                detail = 8
            } else if(position === 'free') {
                detail = 7
            } else if(position === 'board'){
                detail = 9
            } else {
                detail = context.state.codeDetail
            }
            let projectIdx = 0;
            if(sessionStorage.getItem("project") !== null){
                projectIdx = sessionStorage.getItem("project")
            }
            axios.get('/getArticleNum', {
                    params : {
                        key : context.state.key,
                        selected : context.state.selected,
                        codeDetails : detail,
                        projectIdx : projectIdx,
                    }
                }
            )
                .then(e => {
                    context.commit('setNumberOfArticle', e.data)
                })
        },

        getMoreList(context, position) {
            let detail
            if(position === 'qna') {
                detail = 8
            } else if(position === 'free') {
                detail = 7
            } else if(position === 'board'){
                detail = 9
            } else {
                detail = context.state.codeDetail
            }
            let projectIdx = 0
            if(sessionStorage.getItem("project") !== null){
                projectIdx = sessionStorage.getItem("project");
            }
            if(context.state.axiosState) {
                return
            }
            context.commit('setAxiosState', true)
            axios.get('/boardTest',
                {
                    params: {
                        selected: context.state.selected,
                        key: context.state.key,
                        articleOnvView: context.state.articlesOnView,
                        codeDetail: detail,
                        token : sessionStorage.getItem("token"),
                        projectIdx : projectIdx
                    }
                })
                .then(e => {
                    for (let item of e.data.boardList) {
                        context.commit('pushToBoardList', item)
                    }
                    context.commit('setArticlesOnView', e.data.boardList.length)
                    context.commit('setAxiosState', false)
                })
        },

        getComments(context, item) {
            axios.post('/BoardComment', {
                boardIdx : item.boardIdx,
                commentsOnView : item.commentsOnView,
                token : sessionStorage.getItem("token")
            })
                .then(e => {
                    context.commit('changeIsOpen', item)

                    for (let item of e.data) {
                        item.isOpen = false
                        item.isUpdate = false
                        item.isFinish = false
                        item.isModify = true
                    }
                    const obj = {
                        _board: item,
                        _comment: e.data
                    }
                    context.commit('pushToComment', obj)
                })
        },

        extraComments(context, item) {
            axios.post('/BoardComment', {
                boardIdx : item.boardIdx,
                commentsOnView : item.commentsOnView,
                token : sessionStorage.getItem("token")
            })
                .then(e => {
                    for (let item of e.data) {
                        item.isOpen = false
                        item.isUpdate = false
                        item.isFinish = false
                        item.isModify = true
                    }
                    item.commentsOnView += e.data.length;
                    const payload = {
                        board: item,
                        commentList: e.data
                    }
                    context.commit('addingToCommentList', payload)
                })
        }
    }
}

export default community