import {
  Renderer,
  Program,
  Color,
  Mesh,
  Triangle,
  RenderTarget,
  Texture,
} from "ogl";

const vertex = /* glsl */ `
                attribute vec2 uv;
                attribute vec2 position;


                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = vec4(position.x, position.y, 0, 1);
                }
            `;

const fragment = /* glsl */ `
                precision highp float;

                uniform float uTime;

                varying vec2 vUv;

                float hash(float n) { return fract(sin(n) * 1e4); }
                float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
                float noise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }


                void main() {
                  float n = noise(vUv * 10.0 + uTime/20.0);
                  float wave = (cos(vUv.x * 50.0 + uTime/10.0) + 1.0)/2.0 * 0.4;
                  float f = (n + wave) /2.0;
                    gl_FragColor.rgb = vec3(1.0, 1.0, 1.0) * f;
                    gl_FragColor.a = 1.0;
                }
            `;

const fragmentCanvas = /* glsl */ `
                precision highp float;

                varying vec2 vUv;
                uniform sampler2D tMap;
                uniform float ncolors;
                uniform float uaspect;
                uniform sampler2D tPal;

                void main() {
                  float n = 70.0;
                  float s = 1.0/n;
                    vec2 coord = vUv - mod(vUv, vec2(s/uaspect, s));
                    vec2 outsq = step(vec2(s/uaspect, s) * 0.75, mod(vUv, vec2(s/uaspect, s)));
                    float noise = min(0.99, texture2D(tMap, coord).x + 0.2);

                    vec3 brume = texture2D(tMap, vec2(noise, noise)).rgb;

                    vec2 u = vec2(noise, 0.0);


                    gl_FragColor.rgb = texture2D(tPal, u).rgb + brume/7.0;
                    // gl_FragColor.a = 1.0;
                    // gl_FragColor = gl_FragColor * (1.0 - outsq.x) * (1.0 - outsq.y);
                    // gl_FragColor.rgb = vec3(1.0, 0.0, 0.0) * noise;

                    // gl_FragColor.rgb = vec3(1.0, 1.0, 1.0) * noise;
                    gl_FragColor.a = 1.0;
                }
            `;

{
  const renderer = new Renderer({ alpha: true });
  const gl = renderer.gl;
  gl.canvas.id = "homecanvas";
  document.body.appendChild(gl.canvas);

  var aspectRatio = 0.0;

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    aspectRatio = window.innerWidth / window.innerHeight;
  }
  window.addEventListener("resize", resize, false);
  resize();

  // Rather than using a plane (two triangles) to cover the viewport here is a
  // triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
  // Excess will be out of the viewport.

  //         position                uv
  //      (-1, 3)                  (0, 2)
  //         |\                      |\
  //         |__\(1, 1)              |__\(1, 1)
  //         |__|_\                  |__|_\
  //   (-1, -1)   (3, -1)        (0, 0)   (2, 0)

  const geometry = new Triangle(gl);

  // const palette = ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"];
  var palette = [
    "#7400b8",
    "#6930c3",
    "#5e60ce",
    "#5390d9",
    "#4ea8de",
    "#48bfe3",
    "#56cfe1",
    "#64dfdf",
    "#72efdd",
    "#80ffdb",
  ];

  // var palette = ["#02010a", "#04052e", "#140152", "#22007c", "#0d00a4"];
  // var palette = ["#ff0000", "#00ff00", "#0000ff"];
  var palette = ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#90e0ef"];

  var palette = [
    "#012a4a",
    "#013a63",
    "#01497c",
    "#014f86",
    "#2a6f97",
    "#2c7da0",
    "#468faf",
    "#61a5c2",
    "#89c2d9",
  ];

  var pls = [
    ["#00072d", "#001c55", "#0a2472", "#0e6ba8", "#a6e1fa"],
    ["#6f2dbd", "#a663cc", "#b298dc", "#b8d0eb", "#b9faf8"],
    ["#132a13", "#31572c", "#4f772d", "#90a955", "#ecf39e"],
    [
      "#131316",
      "#1c1c21",
      "#26262c",
      "#2f3037",
      "#393a41",
      "#4b4c52",
      "#5b5c62",
      "#6a6b70",
    ],
    [
      "#ffadad",
      "#ffd6a5",
      "#fdffb6",
      "#caffbf",
      "#9bf6ff",
      "#a0c4ff",
      "#bdb2ff",
      "#ffc6ff",
      "#fffffc",
    ],
    [
      "#f72585",
      "#b5179e",
      "#7209b7",
      "#560bad",
      "#480ca8",
      "#3a0ca3",
      "#3f37c9",
      "#4361ee",
      "#4895ef",
      "#4cc9f0",
    ],
  ];
  var palette = pls[pls.length - 1];

  // gemini javascript ninja, TODO understand the syntax?
  const hexToRGBAUint8 = (colors) =>
    new Uint8Array(
      colors.flatMap((hex) => [
        ...hex
          .slice(1)
          .match(/.{2}/g)
          .map((v) => parseInt(v, 16)),
        255,
      ]),
    );

  // Usage:
  const paletteData = hexToRGBAUint8(palette);

  const texturePalette = new Texture(gl, {
    image: paletteData,
    width: palette.length,
    height: 1,
    magFilter: gl.NEAREST,
  });
  // A little data texture with 4 colors just to keep things interesting
  // const paletteTexture = new Texture(gl, {
  //   image: textureData,
  //   width: palette.length,
  //   height: 1,
  //   magFilter: gl.NEAREST,
  // });

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uaspect: { value: aspectRatio },
      uTime: { value: 0 },
      // uColor: { value: new Color(0x9c9583) },
      uColor: { value: new Color(0xb1ada1) },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  // render the noise texture to a render target first
  targetTexture = new RenderTarget(gl);

  const programCanvas = new Program(gl, {
    vertex,
    fragment: fragmentCanvas,
    uniforms: {
      uaspect: { value: aspectRatio },
      tMap: { value: targetTexture.texture },
      tPal: { value: texturePalette },
      ncolors: { value: palette.length },
    },
  });
  const mesh2 = new Mesh(gl, { geometry, program: programCanvas });

  requestAnimationFrame(update);
  function update(t) {
    requestAnimationFrame(update);

    program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene: mesh, target: targetTexture });

    programCanvas.uniforms.uaspect.value = aspectRatio;
    // Don't need a camera if camera uniforms aren't required
    // don't need target if rendering to canvas
    gl.clearColor(1, 1, 1, 0);
    renderer.render({ scene: mesh2 });
    // renderer.render({ scene: mesh });
  }
}

window.onload = function () {
  let white = document.getElementById("white");
  let pupil = document.getElementById("pupil");
  let body = document.getElementById("body");
  let blush = document.getElementById("blush");
  let eyelid = document.getElementById("eyelid");
  let mouth = document.getElementById("mouth");

  let bounds_guy = guy.getBoundingClientRect();
  // white and pupil are guaranteed to have the same bouding rect
  let bounds_eye = white.getBoundingClientRect();
  // offsetting to the center of the image
  function update_bounds() {
    bounds_guy = guy.getBoundingClientRect();
    // white and pupil are guaranteed to have the same bouding rect
    bounds_eye = white.getBoundingClientRect();
    // offsetting to the center of the image
  }

  function updateEye(mx, my) {
    let eyex = bounds_eye.x + bounds_eye.width / 2;
    let eyey = bounds_eye.y + bounds_eye.height / 2;
    // console.log(mx, my);
    let vec = { x: mx - eyex, y: my - eyey };
    // console.log(vec);

    function dist(x, y) {
      return Math.sqrt(x * x + y * y);
    }

    // inner and outer radius for max value
    let outer = 200;

    // @inner inner scaling sphere, different between eyes
    // @outer maximum distance for bounding of mouse's pull
    // @vec the vector from the center of the eye to the mouse in px
    function getoff(inner, outer, vec) {
      let d = dist(vec.x, vec.y);

      // cap max outside of influence zone
      if (d > outer) {
        // artificially set vector's end to the circle's surface
        vec.x *= outer / d;
        vec.y *= outer / d;
        d = dist(vec.x, vec.y);
      }
      // translate the vector from center to outer, to center to inner
      let ratio = d / outer;
      return {
        x: (ratio * vec.x * inner) / outer,
        y: (ratio * vec.y * inner) / outer,
      };
    }

    let off = getoff(outer / 8, outer, vec);
    white.style.transform = `translate(${off.x}px, ${off.y}px)`;
    eyelid.style.transform = `translate(${off.x}px, ${off.y}px)`;

    off = getoff(outer / 4, outer, vec);
    pupil.style.transform = `translate(${off.x}px, ${off.y}px)`;
  }

  function update_guy(mx, my) {
    updateEye(mx, my);

    let guyx = bounds_guy.x + bounds_guy.width / 2;
    // We want the bottom of the screen as our guy root, so let's just overflow that so that angle are relatives to that point
    let guyy = bounds_guy.y + 10000;
    let vec = { x: mx - guyx, y: my - guyy };
    let angle = Math.tanh(vec.x / vec.y);

    let ratio =
      Math.min(Math.abs(vec.x), bounds_guy.width / 2) / bounds_guy.width / 2;
    angle *= ratio;
    // capping the angle
    angle = Math.abs(angle) > 0.08 ? 0.08 * Math.sign(angle) : angle;
    // update the guy
    // negative signe because he needs to tilt in the opposite direction of the mouse
    body.style.transform =
      "skew(" +
      angle +
      "rad) translateX(" +
      20 * ratio * Math.sign(vec.x) +
      "px)";
    blush.style.transform =
      "skew(" +
      angle +
      "rad) translateX(" +
      20 * ratio * Math.sign(vec.x) +
      "px)";
  }

  document.onresize = (e) => {
    update_bounds();
    update_guy(0, 0);
  };
  document.onmousemove = (e) => {
    update_guy(e.clientX, e.clientY);
  };

  let dialogbox = document.getElementById("dialog");
  let timer = null;
  function update_diag(s) {
    mouth.classList.add("talking");
    if (timer != null) clearInterval(timer);
    dialogbox.innerText = "";
    let i = 0;
    timer = setInterval(addchar, 70);
    function addchar() {
      if (s[i] == " " && i + 1 < s.length) {
        dialogbox.innerText += " " + s[i + 1];
        i++;
      } else {
        dialogbox.innerText += s[i];
      }
      i++;
      if (i >= s.length) {
        clearInterval(timer);
        mouth.classList.remove("talking");
      }
    }
  }
  document.onclick = () => {
    update_diag("Seb la grosse pute");
  };

  let blush_timer = null;
  document.getElementById("guy").onclick = (e) => {
    if (blush_timer != null) clearTimeout(blush_timer);
    let bound = blush.getBoundingClientRect();
    let x = e.clientX - bound.x;
    let y = e.clientY - bound.y;

    if (
      x - 20 > (1 / 3) * bound.width &&
      x - 20 < (2 / 3) * bound.width &&
      y > (1 / 3) * bound.height
    ) {
      console.log("clicking");
      blush.classList.add("blushing");
      blush_timer = setTimeout(() => {
        blush.classList.remove("blushing");
        eyelid.classList.remove("closed");
      }, 2000);
    }
  };

  // random blinking
  let blink_timer = null;
  function blink() {
    eyelid.classList.add("closed");
    setTimeout(() => {
      eyelid.classList.remove("closed");
    }, 200);
    blink_timer = setTimeout(blink, 250 + Math.random() * 3000);
  }

  function start_blinking() {
    blink_timer = setTimeout(blink, 250 + Math.random() * 3000);
  }
  function stop_blinking() {
    clearTimeout(blink_timer);
  }

  start_blinking();

  function hide() {
    stop_blinking();

    start_blinking();
  }
};
