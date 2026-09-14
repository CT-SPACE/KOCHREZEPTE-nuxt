<template>
    <div class="bundle">
<div class="backgroundAni"></div>
<div class="firstLayer"></div>
<div class="lastLayer"></div>
</div>
</template>
<script>

</script>



<style>
.bundle {
	width:100vw;
    min-height:120px;
    max-height:180px;
    position:relative;
    background: radial-gradient(
  circle,
  #c2f0a2,
  transparent);
  bottom: 0;
  right:0;
}
.backgroundAni{
background: repeating-radial-gradient(ellipse at bottom left,  transparent, #74dc38, transparent, #9ac244 , #c8e2bc, #effae8, transparent); 
	height: 400%;
    width:100%;
      position: absolute;
      bottom:0;
      left:0;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.4;
  animation: rotate 14s infinite alternate;

	overflow: hidden;
}

.firstLayer {
	background-image: radial-gradient(ellipse at top right,  #3b9a04,transparent, #c8e2bc, #effae8,transparent, #d5f4b1, #92dc59, #d3eac5, #68a83e, #d5e9b2);
	height: 100%;
    width:100%;
      position: absolute;
      top:0;
      right:0;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.8;
  animation: pulse 4s infinite alternate;

	overflow: hidden;
}

.lastLayer{
    z-index:10;
    width:80px;
    aspect-ratio:1;
    position:absolute;
    right:2vw;
    bottom: 10px;
    height:auto;
    background-image: url(../assets/icons/olive-oil.svg);
    background-size: contain;
}
@keyframes pulse {
  0% { transform: scale(1.4) }
100% { transform: scale(2.4)}
}
@keyframes rotate {
  0% { transform: rotate(0deg) }
  50% { transform: rotate (180deg)}
100% { transform: rotate(360deg)}
}

@media screen and (max-width: 760px){
    .lastLayer{
        right: 0px;
    }
}
@media screen and (max-width: 700px){
    .bundle{
        height:180px;
    }
}
</style>