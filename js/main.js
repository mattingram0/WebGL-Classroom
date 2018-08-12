  // Global variables:
  var globalEye = [0.0, 12.0, 60.0];        // CENTER POS
  var globalCenter = [0.0, 10.0, 0.0];     // CENTER POS
  var globalUp = [0, 1, 0];                 // The world vertical direction
  var globalTheta = -Math.PI/2;             // Our viewing angle around the Y axis (vertical axis) in the world (in radians)
  var globalPhi = 0;                        // Our viewing angle around the X (left to right axis) in the world (in radians)
  var globalCanvas;                         // Our canvas object
  var globalAngleStep = 2.0;                // How much to rotate per button press (in degrees for ease of use)                      
  var globalMovementStep = 2.0;             // How much to move per button press
  var globalTranslationStep = 0.5;          // How much to translate chair by per mouse wheel movement
  var globalRadius = 50;                    // Distance between eye and focal point
  var globalDoorRotation = 35.0;             // Angle the door has opened by 0 - 110 degrees;
  var globalChairTranslate = 2.0;           // Distance chair has been translated by


function main() {

  // Retrieve <globalCanvas> element
  globalCanvas = document.getElementById('webgl');

  // Retrieve shader source from HTML elements
  var vShaderSrc = getShaderSource("vertexShader");
  var fShaderSrc = getShaderSource("fragmentShader");

  // Return if we were unable to load the source for the shaders
  if(vShaderSrc == -1 || fShaderSrc == -1) return -1;

  // Get the rendering context for WebGL
  var gl = getWebGLContext(globalCanvas);
  if (!gl) {
    console.log('[-] Failed to get the rendering context for WebGL');
    return -1;
  }

  // Initialize shaders
  if (!initShaders(gl, vShaderSrc, fShaderSrc)) {
    console.log('[-] Failed to intialize shaders.');
    return -1;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(g_dayColor[0], g_dayColor[1], g_dayColor[2], g_dayColor[3]);
  gl.enable(gl.DEPTH_TEST);

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('[-] Failed to set the vertex information');
    return -1;
  }

  //Error during setup
  if(gl == -1) return;

  //Get lighting uniforms from vertex shader:
  var u_rightPointLightPosition = gl.getUniformLocation(gl.program, 'u_RightPointLightPosition');
  var u_rightPointLightColor = gl.getUniformLocation(gl.program, 'u_RightPointLightColor');
  var u_leftPointLightPosition = gl.getUniformLocation(gl.program, 'u_LeftPointLightPosition');
  var u_leftPointLightColor = gl.getUniformLocation(gl.program, 'u_LeftPointLightColor');
  var u_ambientLightColor = gl.getUniformLocation(gl.program, 'u_AmbientLightColor');
  var u_useRightLight = gl.getUniformLocation(gl.program, 'u_UseRightLight');
  var u_useLeftLight = gl.getUniformLocation(gl.program, 'u_UseLeftLight');
  var u_useAmbientLight = gl.getUniformLocation(gl.program, 'u_UseAmbientLight');

  //Set lighting uniforms in vertex shader
  gl.uniform3fv(u_rightPointLightPosition, new Float32Array([5.0, 10.0, 10.0]));
  gl.uniform3fv(u_rightPointLightColor, new Float32Array([0.9, 0.9, 0.9]));
  gl.uniform3fv(u_leftPointLightPosition, new Float32Array([-10.0, 10.0, 30.0]));
  gl.uniform3fv(u_leftPointLightColor, new Float32Array([0.3, 0.3, 0.3]));
  gl.uniform3fv(u_ambientLightColor, new Float32Array([0.2, 0.2, 0.2]));
  gl.uniform1i(u_useRightLight, true);
  gl.uniform1i(u_useLeftLight, false);
  gl.uniform1i(u_useAmbientLight, true);

  // Get the storage locations of uniform variables
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_UseTextures = gl.getUniformLocation(gl.program, 'u_UseTextures'); 
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_MvpMatrix || !u_NormalMatrix || !u_Color || !u_ModelMatrix || !u_ModelMatrix || !u_UseTextures
    || !u_Sampler) {
    console.log('Failed to get the storage locations for uniforms');
    return;
  }

  // Calculate the view projection matrix
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(55.0, globalCanvas.width / globalCanvas.height, 1.0, 200.0);
  viewProjMatrix.lookAt(globalEye[0], globalEye[1], globalEye[2], globalCenter[0], globalCenter[1], globalCenter[2],
    globalUp[0], globalUp[1], globalUp[2]);

  //Create textures and images
  var floorTexture = gl.createTexture();               
  var sigTexture = gl.createTexture();
  if (!floorTexture || !sigTexture) {
    console.log('Failed to create texture objects');
    return false;
  }

  floorTexture.image = new Image();  
  sigTexture.image = new Image();                   
  if (!floorTexture.image || !sigTexture.image) {
    console.log('Failed to create the floor image object');
    return false;
  }

  floorTexture.image.src = 'tex/floor/floorColor.jpg';
  sigTexture.image.src = 'tex/sig/sig1.jpg'

  var textures = [floorTexture, sigTexture];
  var lights = [u_useRightLight, u_useLeftLight, u_useAmbientLight];

  gl.uniform1i(u_UseTextures, g_useTextures);

  //Add keydown listeners
  document.onkeydown = function(ev){ keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures, lights); };

  //Add scroll listener
  window.addEventListener("wheel", function(event){
    event.preventDefault();
    if(event.deltaY > 0 && globalChairTranslate > 0){
      globalChairTranslate -= globalTranslationStep;
    }
    if(event.deltaY < 0 && globalChairTranslate < 10){
      globalChairTranslate += globalTranslationStep;
    }

    //Draw the room
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures, globalDoorRotation, globalChairTranslate);
}, false);

  //Ensure all images are loaded before
  var images = [floorTexture.image, sigTexture.image];
  var numImages = images.length;
  var loadedImages = 0;

  //Loop through each image, setting the onload function. Only when all are loaded will inner if statement be satisfied
  for(var i = 0; i < numImages; i++){
    images[i].onload = function(){
      loadedImages++;
      if(loadedImages == numImages) draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix, u_Color, u_Sampler, u_UseTextures, textures, globalDoorRotation, globalChairTranslate);
    }
  }
}