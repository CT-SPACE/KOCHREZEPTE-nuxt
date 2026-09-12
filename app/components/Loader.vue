<template> 
<div class="loader">
 <div class="loader-ball-53">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
</template>

<style scoped>
.loader{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
}

.loader-ball-53 {
    height: 20px;
    display: inline-block;
}
.loader-ball-53 > div {
    width: 6px;
    height: 6px;
    border-radius: 100%;
    box-shadow: 0 0 0px rgb(68, 136, 4);
    background: #baf154;
    float: left;
    margin: 3px;
    transform: scale(2);
}
.loader-ball-53 > div:nth-child(1) {
    animation: anm-BL-53-move1 1s infinite linear;
}
.loader-ball-53 > div:nth-child(2) {
    animation: anm-BL-53-move2 1s infinite linear;
    animation-delay: 0.2s;
}
.loader-ball-53 > div:nth-child(3) {
    animation: anm-BL-53-move3 1s infinite linear;
    animation-delay: 0.3s;
}
.loader-ball-53 > div:nth-child(4) {
    animation: anm-BL-53-move4 1s infinite linear;
    animation-delay: 0.4s;
}
.loader-ball-53 > div:nth-child(5) {
    animation: anm-BL-53-move5 1s infinite linear;
    animation-delay: 0.5s;
}
@keyframes anm-BL-53-move1 {
    50% {
        background: rgb(68, 136, 4);
        transform: scale(1);
    }
}
@keyframes anm-BL-53-move2 {
    50% {
        background:rgb(68, 136, 4);
        transform: scale(1);
    }
}
@keyframes anm-BL-53-move3 {
    50% {
        background: rgb(68, 136, 4);
        transform: scale(1);
    }
}
@keyframes anm-BL-53-move4 {
    50% {
        background: rgb(68, 136, 4);
        transform: scale(1);
    }
}
@keyframes anm-BL-53-move5 {
    50% {
        background: rgb(68, 136, 4);
        transform: scale(1);
    }
}
</style>