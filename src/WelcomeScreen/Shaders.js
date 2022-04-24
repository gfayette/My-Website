export default class Shaders {

  static vtext = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    uniform vec4 rotation;

    varying highp vec2 vTextureCoord;

    void main(void) {
      vec4 vpos = aVertexPosition;
      if(rotation.x != 0.0){
        float s = sin(rotation.w);
        float c = cos(rotation.w);
        float x = c * (vpos.x - rotation.x) + s * (vpos.y - rotation.y) + rotation.x;
        float y = -1.0 * s * (vpos.x - rotation.x) + c * (vpos.y - rotation.y) + rotation.y;
        vpos.x = x;
        vpos.y = y;
      }

      gl_Position = uProjectionMatrix * uModelViewMatrix * vpos;
      vTextureCoord = aTextureCoord;
    }
`

  static ftext = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform highp vec4 screen;
    uniform highp vec4 shaderArgs;
    uniform highp vec4 effectCoords;
    uniform highp vec4 colorMask;
    uniform highp vec4 texColor;
    uniform highp vec4 effectArgs;

    void replaceColor() {
      if(gl_FragColor.r > 0.0 && gl_FragColor.a > 0.0 && gl_FragColor.r == gl_FragColor.b && gl_FragColor.g == 0.0) {
        highp float m = gl_FragColor.a;
        gl_FragColor.r = texColor.r * m;
        gl_FragColor.g = texColor.g * m;
        gl_FragColor.b = texColor.b * m;
        gl_FragColor.a = texColor.a * m;          
      }
    }
    
    void mask() {
      gl_FragColor *= colorMask;
      normalize(1.0); 
    }

    void post() {
      highp float xdist0 = gl_FragCoord.x - effectArgs.x;
      highp float ydist0 = gl_FragCoord.y - effectArgs.y;
  
      highp float r = effectArgs.z;
      highp float mult = effectArgs.w;
      highp float xy = xdist0 * xdist0 + ydist0 * ydist0;
      highp float hy = sqrt(xy);
      highp float hy0 = r - hy;
  
      highp vec2 t = vTextureCoord;
      if(hy < r) {
        highp float m = mult * hy0 / r;

        highp float addx = -1.0 * xdist0 * m;
        highp float addtx = addx / screen.x;
        highp float tx = t.x + addtx;

        highp float addty = -1.0 * ydist0 * m / screen.y;
        highp float ty = t.y + addty;

        highp vec2 uv = vec2(tx, ty);
        gl_FragColor = texture2D(uSampler, uv);

        highp float ratio = hy0 / r;
        if(ratio < 0.18) {
            ratio = 0.18 - ratio;
            highp float m = ratio / 0.36;
            highp vec4 m4 = vec4(-0.4 * m, -0.18 * m, -0.14 * m, 0.0);
            gl_FragColor += m4;
        }

        normalize(1.0);
        gl_FragColor.a = 1.0;

        if(m > 1.0 || tx < 0.0 || tx > 1.0 || ty > 1.0 || ty < 0.0) {
            gl_FragColor.r = 0.0;
            gl_FragColor.g = 0.0;
            gl_FragColor.b = 0.0;
            gl_FragColor.a = 0.0;
        }
      }
      else{
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        gl_FragColor.a = 1.0;
      }
    }

    void main(void) {
      if(shaderArgs.x < 0.0) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        if(texColor.r >= -0.5) {
            replaceColor();
        }
        if(colorMask.r >= -0.5) {
            mask();
        }
      } 
      else {
        if(effectArgs.x > -0.5){         
          post();
        }
        else {
          gl_FragColor = texture2D(uSampler, vTextureCoord);
          gl_FragColor.a = 1.0;
        }
      }
    }
`
}