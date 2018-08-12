function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures, doorRotation, chairTranslation) {
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var wallThickness = 0.1
  var frameThickness = 0.1;

  drawFloor(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, wallThickness, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures);
  drawWalls(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, wallThickness, u_ModelMatrix, u_Color, textures);
  drawWindows(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, frameThickness);
  drawBoard(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures);
  drawDoor(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, doorRotation);
  drawTables(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color);
  
  //Draw two chairs at a time
  drawChairs(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color);

  //Rotate and translate before recalling the drawChairs method
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(10, 0, -30);
  g_modelMatrix.rotate(180, 0, 1, 0);
  drawChairs(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color);
  g_modelMatrix = popMatrix();

  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(10, 0, -5.0);
  g_modelMatrix.rotate(180, 0, 1, 0);
  drawChairs(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color);
  g_modelMatrix = popMatrix();

  //Send the chair translation this time, to demonstrate dynamic translations
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(0, 0, 25.0);
  drawChairs(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, chairTranslation);
  g_modelMatrix = popMatrix();

}

function drawBox(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color) {

  //Set default box color to a light grey
  if(color == null) color = new Float32Array([0.4, 0.4, 0.4, 1.0]);

  //Set the color in the vertex shader
  gl.uniform4fv(u_Color, color);

  //Set the model matrix in the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);

  pushMatrix(g_modelMatrix);   // Save the model matrix
    // Scale a cube and draw
    g_modelMatrix.scale(width, height, depth);
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    // 
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  g_modelMatrix = popMatrix();   // Retrieve the model matrix
}

function drawWalls(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, wallThickness, u_ModelMatrix, u_Color, textures){
  var wallColor = new Float32Array([0.84, 0.86, 0.81, 1.0]);

  var u_UseTextures = gl.getUniformLocation(gl.program, 'u_UseTextures');
  gl.uniform1i(u_UseTextures, false); 

  //Draw right wall
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(20.0, 10.0, -5.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 20.0, wallThickness, 50.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, wallColor);
  g_modelMatrix = popMatrix();

  //Draw left wall
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-20.0, 10.0, -5.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 20.0, wallThickness, 50.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, wallColor);
  g_modelMatrix = popMatrix();

  //Draw back wall
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(0.0, 10.0, -30.0);
  g_modelMatrix.rotate(90, 1, 0, 0);
  drawBox(gl, n, 40.0, wallThickness, 20.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, wallColor);
  g_modelMatrix = popMatrix();

  //Draw top wall
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(0.0, 20.0, -5.0);
  drawBox(gl, n, 40.0, wallThickness, 50.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, wallColor);
  g_modelMatrix = popMatrix();
}

function drawFloor(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, wallThickness, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures){

  var floorColor = new Float32Array([0.51, 0.56, 0.45, 1.0]);

  if(g_useTextures){

    //Bind textures and set uniforms required for texture drawing
    var floorTexture = textures[0];
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, floorTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, floorTexture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.uniform1i(u_Sampler, 0);
    gl.uniform1i(u_UseTextures, g_useTextures);

    //Draw textured floor
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, -5.0);
    drawBox(gl, n, 40.0, wallThickness, 50.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, textures);
    g_modelMatrix = popMatrix();
  } else {

    var u_UseTextures = gl.getUniformLocation(gl.program, 'u_UseTextures');
    gl.uniform1i(u_UseTextures, g_useTextures); 
    //Draw a non textured floor
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, -5.0);
    drawBox(gl, n, 40.0, wallThickness, 50.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, floorColor);
    g_modelMatrix = popMatrix();
  }
}

function drawWindows(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, frameThickness){
  var color = new Float32Array([0.41, 0.27, 0.16, 1.0]);
  var noColor = new Float32Array([0.0, 0.0, 0.0, 0.0]);

  //Draw transparent window backgrounds
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(20.0, 9.5, -5.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7.0, 0.11, 20.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, noColor);
  g_modelMatrix = popMatrix();

  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-19.99, 9.5, -5.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7.0, 0.11, 20.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, noColor);
  g_modelMatrix = popMatrix();

  //Draw right window:
  //Draw top frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(19.9, 13.0, -5.0);
  g_modelMatrix.rotate(90, 0, 1, 0);
  drawBox(gl, n, 20.0, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw middle frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(19.9, 9.5, -5.0);
  g_modelMatrix.rotate(90, 0, 1, 0);
  drawBox(gl, n, 20.0, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw bottom frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(19.9, 6.0, -5.0);
  g_modelMatrix.rotate(90, 0, 1, 0);
  drawBox(gl, n, 20.0, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw right frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(19.9, 9.51, 5.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw left frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(19.9, 9.51, -15.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw left inner frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(19.9, 9.51, -9.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw right inner frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(19.9, 9.51, -1.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw left window
  //Draw top frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-19.9, 13.0, -5.0);
  g_modelMatrix.rotate(90, 0, 1, 0);
  drawBox(gl, n, 20.0, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw middle frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-19.9, 9.5, -5.0);
  g_modelMatrix.rotate(90, 0, 1, 0);
  drawBox(gl, n, 20.0, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw bottom frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-19.9, 6.0, -5.0);
  g_modelMatrix.rotate(90, 0, 1, 0);
  drawBox(gl, n, 20.0, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw right frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-19.9, 9.51, 5.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw left frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-19.9, 9.51, -15.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw left inner frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-19.9, 9.51, -9.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Draw right inner frame
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-19.9, 9.51, -1.0);
  g_modelMatrix.rotate(90, 0, 0, 1);
  drawBox(gl, n, 7, frameThickness, frameThickness, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();
}

function drawBoard(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures){
  
  var outerColor = new Float32Array([0.42, 0.48, 0.54, 1.0]);
  var innerColor = new Float32Array([0.93, 0.93, 0.93, 1.0]);

  //Draw outerboard
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(5.0, 10.0, -29.75);
  g_modelMatrix.rotate(90, 1, 0, 0);
  drawBox(gl, n, 16.0, 0.05, 10.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, outerColor);
  g_modelMatrix = popMatrix();

  //Draw innerboard
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(5.0, 10.0, -29.5);
  g_modelMatrix.rotate(90, 1, 0, 0);
  drawBox(gl, n, 15.75, 0.05, 9.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, innerColor);
  g_modelMatrix = popMatrix();

  //EASTER EGG: Draw signature
  //Bind textures and set uniforms required for texture drawing
  //Only draw when not using floor textures, and when both ambient light, left light and right light are on
  if(!g_useTextures && g_useRightLight && g_useAmbientLight && g_useLeftLight){
    var sigTexture = textures[1];
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sigTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, sigTexture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.uniform1i(u_Sampler, 0);
    gl.uniform1i(u_UseTextures, true);

    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(11.5, 6.5, -29.4999);
    g_modelMatrix.rotate(90, 1, 0, 0);
    drawBox(gl, n, 2, 0.05, 2, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, outerColor);
    g_modelMatrix = popMatrix();
  }

  gl.uniform1i(u_UseTextures, false);
}

function drawDoor(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, doorRotation){
  var innerColor = new Float32Array([0.41, 0.27, 0.16, 1.0]);
  var outerColor = new Float32Array([0.34, 0.3, 0.24, 1.0]);
  var noColor = new Float32Array([0.0, 0.0, 0.0, 0.0]);

  //Draw outerdoor
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-12.5, 6.5, -29.75);
  g_modelMatrix.rotate(90, 1, 0, 0);
  drawBox(gl, n, 7.0, 0.04, 13.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, outerColor);
  g_modelMatrix = popMatrix();

  //Draw hollowdoor
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-12.5, 6.5, -29.75);
  g_modelMatrix.rotate(90, 1, 0, 0);
  drawBox(gl, n, 6.5, 0.05, 12.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, noColor);
  g_modelMatrix = popMatrix();

  //Draw innerdoor
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-12.5, 6.5, -29.7);
  g_modelMatrix.rotate(90, 1, 0, 0);

  //Rotate door:
  g_modelMatrix.translate(-3.25, 0, 0);
  g_modelMatrix.rotate(doorRotation, 0, 0, 1);
  g_modelMatrix.translate(3.25, 0, 0);

  drawBox(gl, n, 6.5, 0.04, 12.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, innerColor);
  g_modelMatrix = popMatrix();

  //Draw handle
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-10.5, 5.5, -29.65);
  g_modelMatrix.rotate(90, 1, 0, 0);

  //Rotate handle:
  g_modelMatrix.translate(-5.26, 0, 0);
  g_modelMatrix.rotate(doorRotation, 0, 0, 1);
  g_modelMatrix.translate(5.26, 0, 0);
  drawBox(gl, n, 1.0, 0.04, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, outerColor);
  g_modelMatrix = popMatrix();
}

function drawTables(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color,){
  var color = new Float32Array([0.41, 0.27, 0.16, 1.0]);

  //Far Table
  //Table surface
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(5.0, 5.0, -15);
  drawBox(gl, n, 7.5, 0.2, 15.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Table legs
  //Near left
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(2.0, 0, -8.0);
  drawBox(gl, n, 0.75, 5.0, 0.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Near Right
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(8.0, 0, -8.0);
  drawBox(gl, n, 0.75, 5.0, 0.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Back Left
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(2.0, 0, -22.0);
  drawBox(gl, n, 0.75, 5.0, 0.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Back Right
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(8.0, 0, -22.0);
  drawBox(gl, n, 0.75, 5.0, 0.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Near Table
  //Table surface
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(5.0, 5.0, 10);
  drawBox(gl, n, 7.5, 0.2, 15.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Table legs
  //Near left
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(2.0, 0, 17.0);
  drawBox(gl, n, 0.75, 5.0, 0.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Near Right
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(8.0, 0, 17.0);
  drawBox(gl, n, 0.75, 5.0, 0.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Back Left
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(2.0, 0, 3.0);
  drawBox(gl, n, 0.75, 5.0, 0.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();

  //Back Right
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(8.0, 0, 3.0);
  drawBox(gl, n, 0.75, 5.0, 0.75, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, color);
  g_modelMatrix = popMatrix();
}

function drawChairs(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, chairTranslation){
  legColor = new Float32Array([0.74, 0.76, 0.78, 1.0]);
  seatColor = new Float32Array([0.41, 0.27, 0.16, 1.0]);

  if(chairTranslation == null) chairTranslation = 0;

  //Near Chair
  //Near right leg
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(0.0 - chairTranslation, 0, -10.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Near left leg
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0 - chairTranslation, 0, -10.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Far right leg
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(0.0 - chairTranslation, 0, -13.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Far left leg
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0 - chairTranslation, 0, -13.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Seat
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-1.5 - chairTranslation, 3.5, -11.50);
  drawBox(gl, n, 3.5, 0.1, 3.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, seatColor);
  g_modelMatrix = popMatrix();

  //Near back support
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0 - chairTranslation, 3.5, -10.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Far back support
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0 - chairTranslation, 3.5, -13.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Back piece
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0 - chairTranslation, 6.0, -11.50);
  g_modelMatrix.rotate(90, 0, 0, 1)
  drawBox(gl, n, 2.0, 0.1, 3.2, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, seatColor);
  g_modelMatrix = popMatrix();


  //Far Chair
  //Near right leg
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(0.0, 0, -17.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Near left leg
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0, 0, -17.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Far right leg
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(0.0, 0, -20.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Far left leg
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0, 0, -20.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Seat
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-1.5, 3.5, -18.50);
  drawBox(gl, n, 3.5, 0.1, 3.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, seatColor);
  g_modelMatrix = popMatrix();

  //Near back support
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0, 3.5, -17.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Far back support
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0, 3.5, -20.0);
  g_modelMatrix.rotate(45, 0, 1, 0);
  drawBox(gl, n, 0.3, 3.5, 0.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, legColor);
  g_modelMatrix = popMatrix();

  //Back piece
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(-3.0, 6.0, -18.50);
  g_modelMatrix.rotate(90, 0, 0, 1)
  drawBox(gl, n, 2.0, 0.1, 3.2, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, seatColor);
  g_modelMatrix = popMatrix();
}

function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}