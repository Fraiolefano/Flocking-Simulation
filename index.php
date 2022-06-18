<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="user-scalable=0">
  <title>Flocking simulation</title>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/addons/p5.sound.min.js"></script>
  <?php
  $keyTime=date("Y_m_d-G_");
  if (date("i")<=30)
  {
      $keyTime.="A";
  }
  else
  {
      $keyTime.="B";
  }
  $stile1="<link rel='stylesheet' href='/pages/base/github/terminal.css?".$keyTime."'>";
  $stile2="<link rel='stylesheet' href='/pages/base/stile.css?".$keyTime."'>";
  $script1="<script src='/pages/base/script.js?".$keyTime."'></script>";
  $script2="<script src='/pages/coding/programs/flockingSimulation/main.js?".$keyTime."'></script>";
  $script3="<script src='/pages/coding/programs/flockingSimulation/InputManager.js?".$keyTime."'></script>";
  $script4="<script src='/pages/coding/programs/flockingSimulation/boid.js?".$keyTime."'></script>";
  $script5="<script src='/pages/coding/programs/flockingSimulation/obstacle.js?".$keyTime."'></script>";
  $script6="<script src='/pages/base/page.js?".$keyTime."'></script>";
  echo $stile1;
  echo $stile2;
  echo $script1;
  echo $script2;
  echo $script3;
  echo $script4;
  echo $script5;
  echo $script6;
  ?>


  

<style>
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }
</style>
</head>
<body>
    <script>createHeader("My Coding Trip");</script>
    <div content class="body_content">
        <center>
            <h1 style="color : #ffc300">FLocking Simulation</h1>
            <h3 style="font-size:24px;">Piccola simulazione del comportamento di creature che si muovono in stormi </h3>

            <script>
            
            page.createPage();
            
            
            </script>
        </center>
        <center>    
            <h2>Codice sorgente:</h2>
            <a href=""></a>
        </center>
    </div>
</body>

</html>