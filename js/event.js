function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures, lights) {

  switch(ev.keyCode){
    case 38: // Up
    case 40: // Down
      move(ev.keyCode);
      break;
    case 37: // Left
    case 39: // Right
      rotate(ev.keyCode);
      break;
    case 84: // T
      toggleTextures();
      break;
    case 82: // R
      toggleRightLight(gl, lights[0]);
      break;
    case 76: // L
      toggleLeftLight(gl, lights[1]);
      break;
    case 65: // A
      toggleAmbientLight(gl, lights[2]);
      break;
    case 32: //Space
      toggleBackground(gl);
      break;
    case 219: // [
    case 221: // ]
      rotateDoor(ev.keyCode);
  }

  viewProjMatrix.setPerspective(55.0, globalCanvas.width / globalCanvas.height, 1.0, 200.0);
  viewProjMatrix.lookAt(globalEye[0], globalEye[1], globalEye[2], globalCenter[0], globalCenter[1], globalCenter[2],
    globalUp[0], globalUp[1], globalUp[2]);

  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures, globalDoorRotation, globalChairTranslate);
}

function move(keyCode){
  var forward = 0.0;

  switch (keyCode) {
    case 38: // Move forward
    forward += globalMovementStep;
    break;
    case 40: // Move backward
    forward -= globalMovementStep;
    break;
    default:
    return;
  }

  globalEye = [globalEye[0] + forward * Math.cos(globalTheta), globalEye[1], globalEye[2] + forward * Math.sin(globalTheta)];
  globalCenter = [globalCenter[0] + forward * Math.cos(globalTheta), globalCenter[1], globalCenter[2] + forward * Math.sin(globalTheta)]
}

function rotate(keyCode){
  var angle = 0.0;

  switch (keyCode){
    case 39: // Rotate right (convert to rad)
    angle += globalAngleStep * 2 * Math.PI / 360.0;
    break;
    case 37: // Rotate left (convert to rad)
    angle -= globalAngleStep * 2 * Math.PI / 360.0;
    break;
    default: 
    return;
  }

  globalTheta = (globalTheta + angle) % (2 * Math.PI);
  globalCenter = [globalEye[0] + (globalRadius * Math.cos(globalTheta)), globalCenter[1],
  globalEye[2] + (globalRadius * Math.sin(globalTheta))];
}

function toggleTextures(){
  g_useTextures = (g_useTextures == false);
}

function toggleRightLight(gl, u_UseRightLight){
  g_useRightLight = (g_useRightLight == false);
  gl.uniform1i(u_UseRightLight, g_useRightLight); 
}

function toggleLeftLight(gl, u_UseLeftLight){
  g_useLeftLight = (g_useLeftLight == false);
  gl.uniform1i(u_UseLeftLight, g_useLeftLight); 
}

function toggleAmbientLight(gl, u_UseAmbientLight){
  g_useAmbientLight = (g_useAmbientLight == false);
  gl.uniform1i(u_UseAmbientLight, g_useAmbientLight); 
}

function toggleBackground(gl){
  g_dayOrNight = (g_dayOrNight == false);

  if(g_dayOrNight){
    gl.clearColor(g_nightColor[0], g_nightColor[1], g_nightColor[2], g_nightColor[3]);
    document.body.style.backgroundColor = g_nightColorHex;
    document.getElementById("instructions").className = "col-6 text-light";
    document.getElementById("heading").className = "text-warning";
  } else {
    gl.clearColor(g_dayColor[0], g_dayColor[1], g_dayColor[2], g_dayColor[3]);
    document.body.style.backgroundColor = g_dayColorHex;
    document.getElementById("instructions").className = "col-6 text-dark";
    document.getElementById("heading").className = "text-muted";
  }
}

function rotateDoor(keyCode){
  if(keyCode == 219){
    if(globalDoorRotation < 120) globalDoorRotation += globalAngleStep;
  } else {
    if(globalDoorRotation > 1) globalDoorRotation -= globalAngleStep;
  }
}
