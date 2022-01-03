<template>
  <div class="container-wrap">
    <div class="how-to-use-container">
      <div class="how-title-box">How To Use</div>
      <div class="how-stack">
        <div
            class="how-cards"
            v-for="card in cards"
            :key="card"
            :id="`card${card.id}`"
        >
          <div class="how-card">
            <img
                class="how-card-img"
                :src="require(`@/assets/${card.img}`)"
                alt="img"
            />
            <div class="how-card-content">
              <div class="how-card-text">
                <div class="how-card-title">
                  {{ card.title }}
                </div>
                {{ card.content }}
              </div>
              <button @click="swap(card.id)" class="how-btn-next">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      cards: [
        {
          id: "5",
          title: "ERD",
          content: `It is a tool that can draw erd.
          Tables can be added, deleted, and relationships can be established.
          When you're done, you can export it to SQL.`,
          img: "how-to-use-edr.jpg",
        },
        {
          id: "4",
          title: "demand",
          content: `It is a tool that can create a demand.
          Team members can write at the same time and check in real time.
          Exportable to Excel and PDF.`,
          img: "how-to-use-demand.jpg",
        },
        {
          id: "3",
          title: "kanban",
          content: `It is a tool to create a Kanban board.
          Cards created by team members can be viewed,
          and your cards can be viewed by other team members.
          When you're done, move it to the Done column so your team can check it out.`,
          img: "how-to-use-kanban.jpg",
        },
        {
          id: "2",
          title: "gantt",
          content: `It is a tool that can draw a Gantt chart.
          You can check and register your work and the work of your team members.
          Charts enable efficient task management.
          Efficient project schedule management through Gantt chart.`,
          img: "how-to-use-gantt.jpg",
        },
        {
          id: "1",
          title: "compiler",
          content: `It is a tool that can compile Java and HTML.
          You can check the result of simple code in real time.
          Files and folders can be added and can be imported into the main class.
          Write code with the kanboo compiler and share it with your team`,
          img: "how-to-use-compiler.jpg",
        },
        {
          id: "0",
          title: "create project",
          content: `Creating a project is the first step to using kanboo.
          Experiment with various features of kanboo by creating a project.
          Compiler, Gantt chart, Kanban board, project board, Git, scheduler, etc. are prepared.`,
          img: "how-to-use-CP.jpg",
        },
      ],
    };
  },
  methods: {
    swap(i) {
      for (let j = 0; j < this.cards.length; j++) {
        let target = document.getElementById(`card${j}`);
        target.style.animation = "";
      }

      let card = this.cards.pop();
      let thisCard = document.getElementById(`card${i}`);
      thisCard.classList += " how-swap";
      console.log(thisCard);
      setTimeout(() => {
        thisCard.className = "how-cards";
      }, 2000);
      this.cards.unshift(card);
    },
  },
};
</script>

<style scoped>
.container-wrap {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.how-to-use-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  overflow: hidden;
  width: 100%;
}

.how-to-use-container,
.how-to-use-container:before,
.how-to-use-container::after {
  box-sizing: border-box;
}

.how-stack {
  margin-top: 50px;
  width: 60vw;
  height: 70vh;
  position: relative;
}

.how-title-box {
  margin-top: 20px;
  font-size: 44px;
  position: relative;
  z-index: 9999;
}

.how-cards {
  padding: 15px;
  background: rgb(44, 47, 59);
  background: linear-gradient(
      60deg,
      rgba(44, 47, 59, 1) 8%,
      rgba(69, 72, 87, 0.9640231092436975) 42%,
      rgba(116, 120, 138, 1) 81%
  );

  width: 80%;
  min-height: 40%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  box-shadow: 0 5px 25px 0 rgba(236, 237, 247, 0.2),
  0 15px 25px 0 rgba(12, 124, 209, 0.1);
  transition: transform 2000ms;
  z-index: 3;
}

.how-cards:nth-last-child(n + 6) {
  --y: calc(-50% - 170px);
  transform: translate(-50%, var(--y)) scale(0.8);
  opacity: 0;
}
.how-cards:nth-last-child(5) {
  --y: calc(-50% - 135px);
  transform: translate(-50%, var(--y)) scale(0.85);
  opacity: 0.1;
}
.how-cards:nth-last-child(4) {
  --y: calc(-50% - 90px);
  transform: translate(-50%, var(--y)) scale(0.9);
  opacity: 0.3;
}
.how-cards:nth-last-child(3) {
  --y: calc(-50% - 45px);
  transform: translate(-50%, var(--y)) scale(0.95);
  opacity: 0.4;
}
.how-cards:nth-last-child(2) {
  --y: calc(-50%);
  transform: translate(-50%, var(--y)) scale(1);
  opacity: 0.9;
}
.how-cards:nth-last-child(1) {
  --y: calc(-50% + 45px);
  transform: translate(-50%, var(--y)) scale(1.05);
  opacity: 1;
}

.how-card {
  padding: 10px;
  margin: 15px;
  position: relative;
  display: flex;
}

.how-card-img {
  width: 240px;
  height: 240px;
  float: left;
  margin-right: 50px;
  border-radius: 25px;
}

.how-card-content {
  text-align: center;
  display: inline;
  margin: 15px 0px 0px 30px;
}

.how-card-text {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 90%;
  font-size: 22px;
}

.how-card-title {
  margin-bottom: 30px;
  text-align: left;
  font-size: 32px;
}

.how-btn-next {
  position: absolute;
  left: 95%;
  bottom: 45%;
  font-size: 44px;
  color: white;
}

.how-swap {
  animation: swap 1200ms forwards;
}

@keyframes swap {
  0% {
    z-index: 50;
    opacity: 1;
  }
  50% {
    transform: translate(50%) scale(0.85) rotate(-15deg);
    animation-timing-function: ease-in;
    opacity: 0.4;
  }
  100% {
    transform: translate(-50% - 90px) scale(0.85);
    z-index: -1;
    opacity: 0.01;
  }
}
</style>