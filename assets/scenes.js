// Routis — schémas de situations routières (vue de dessus, circulation à droite).
// Utilisation : sceneSvg("inter_droite") renvoie un bloc HTML avec le schéma SVG.
// Dans un schéma, le véhicule BLEU "A" est toujours le vôtre ; les rouges (B, C) sont les autres usagers.
(function () {
  const W = 320, H = 240;
  let uid = 0;

  const GRASS = "#9ccc83", ROAD = "#4b4f58", WHITE = "#ffffff", YOU = "#1769e0", OTHER = "#d62430", TRUCK = "#e9ecef";

  function car(x, y, rot, color, label, big) {
    const w = big ? 22 : 18, h = big ? 62 : 34;
    const label2 = label ? `<g transform="rotate(${-rot} 0 ${big ? 0 : 3})"><circle cx="0" cy="${big ? 0 : 3}" r="6.5" fill="#fff"/><text x="0" y="${big ? 4 : 7}" text-anchor="middle" font-size="10" font-weight="800" font-family="Arial,sans-serif" fill="#111">${label}</text></g>` : "";
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="5" fill="${color}" stroke="#101418" stroke-width="1.5"/>
      <rect x="${-w / 2 + 2.5}" y="${-h / 2 + 4}" width="${w - 5}" height="7" rx="2" fill="#cfe8ff"/>
      <rect x="${-w / 2 + 2.5}" y="${h / 2 - 9}" width="${w - 5}" height="5" rx="2" fill="#9ec3e6"/>
      ${label2}</g>`;
  }

  function arrow(d, id) {
    return `<path d="${d}" fill="none" stroke="#ffd43b" stroke-width="4" stroke-dasharray="7 5" stroke-linecap="round" marker-end="url(#${id})"/>`;
  }

  function person(x, y) {
    return `<g transform="translate(${x} ${y}) scale(1.4)"><ellipse cx="0" cy="0" rx="7" ry="4.5" fill="#6a4c93" stroke="#101418" stroke-width="1"/><circle cx="0" cy="0" r="3" fill="#f2c9a0" stroke="#101418" stroke-width="0.8"/></g>`;
  }

  function stopSign(x, y) {
    return `<g transform="translate(${x} ${y})"><rect x="-1.5" y="6" width="3" height="14" fill="#666"/><polygon points="-4,-10 4,-10 10,-4 10,4 4,10 -4,10 -10,4 -10,-4" fill="#d62430" stroke="#fff" stroke-width="1.5"/><text x="0" y="3" text-anchor="middle" font-size="7" font-weight="800" font-family="Arial,sans-serif" fill="#fff">STOP</text></g>`;
  }
  function yieldSign(x, y) {
    return `<g transform="translate(${x} ${y})"><rect x="-1.5" y="6" width="3" height="14" fill="#666"/><polygon points="0,10 -11,-9 11,-9" fill="#fff" stroke="#d62430" stroke-width="3.5" stroke-linejoin="round"/></g>`;
  }
  function priorityDiamond(x, y) {
    return `<g transform="translate(${x} ${y})"><rect x="-1.5" y="6" width="3" height="14" fill="#666"/><polygon points="0,-11 11,0 0,11 -11,0" fill="#ffd43b" stroke="#fff" stroke-width="2"/><polygon points="0,-7 7,0 0,7 -7,0" fill="none" stroke="#111" stroke-width="1"/></g>`;
  }
  function pedSign(x, y) {
    return `<g transform="translate(${x} ${y})"><rect x="-1.5" y="6" width="3" height="14" fill="#666"/><rect x="-10" y="-10" width="20" height="20" rx="3" fill="#1769e0" stroke="#fff" stroke-width="1.5"/><polygon points="0,-7 7,5 -7,5" fill="#fff"/></g>`;
  }
  function trafficLight(x, y, lit) {
    const c = (name, col, cy) => `<circle cx="0" cy="${cy}" r="4.2" fill="${lit === name ? col : "#2a2d31"}"${lit === name ? ' stroke="#fff" stroke-width="1"' : ""}/>`;
    return `<g transform="translate(${x} ${y})"><rect x="-1.5" y="16" width="3" height="10" fill="#666"/><rect x="-7" y="-17" width="14" height="34" rx="4" fill="#15171a"/>${c("red", "#ff3b30", -9)}${c("orange", "#ff9f0a", 0)}${c("green", "#34c759", 9)}</g>`;
  }

  function defs(id) {
    return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ffd43b"/></marker></defs>`;
  }

  // ---- fonds ----
  function crossroads() {
    return `<rect width="${W}" height="${H}" fill="${GRASS}"/>
      <rect x="130" y="0" width="60" height="${H}" fill="${ROAD}"/><rect x="0" y="90" width="${W}" height="60" fill="${ROAD}"/>
      <g stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"><line x1="160" y1="0" x2="160" y2="84"/><line x1="160" y1="156" x2="160" y2="${H}"/><line x1="0" y1="120" x2="124" y2="120"/><line x1="196" y1="120" x2="${W}" y2="120"/></g>`;
  }
  function verticalRoad(center) {
    return `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="120" y="0" width="80" height="${H}" fill="${ROAD}"/>
      <line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="3" ${center === "dashed" ? 'stroke-dasharray="14 12"' : ""}/>`;
  }
  function tJunction() {
    return `<rect width="${W}" height="${H}" fill="${GRASS}"/>
      <rect x="130" y="40" width="60" height="${H - 40}" fill="${ROAD}"/><rect x="0" y="30" width="${W}" height="70" fill="${ROAD}"/>
      <g stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"><line x1="160" y1="108" x2="160" y2="${H}"/><line x1="0" y1="65" x2="${W}" y2="65"/></g>`;
  }
  function roundaboutBase() {
    return `<rect width="${W}" height="${H}" fill="${GRASS}"/>
      <rect x="135" y="0" width="50" height="${H}" fill="${ROAD}"/><rect x="0" y="90" width="${W}" height="50" fill="${ROAD}"/>
      <circle cx="160" cy="115" r="70" fill="${ROAD}"/><circle cx="160" cy="115" r="34" fill="#7fb36a" stroke="#cfd4da" stroke-width="3"/>
      <circle cx="160" cy="115" r="8" fill="#4e8a3e"/>
      <g stroke="${WHITE}" stroke-width="2" stroke-dasharray="8 7"><line x1="160" y1="186" x2="160" y2="${H}"/><line x1="160" y1="0" x2="160" y2="44"/><line x1="0" y1="115" x2="90" y2="115"/><line x1="230" y1="115" x2="${W}" y2="115"/></g>`;
  }

  // ---- scènes ----
  const scenes = {
    inter_droite: {
      alt: "Carrefour sans panneau. Votre véhicule bleu A arrive par le bas. Le véhicule rouge B arrive par votre droite.",
      draw: () => crossroads() + car(175, 200, 0, YOU, "A") + car(252, 105, -90, OTHER, "B")
    },
    inter_gauche: {
      alt: "Carrefour sans panneau. Votre véhicule bleu A arrive par le bas. Le véhicule rouge B arrive par votre gauche.",
      draw: () => crossroads() + car(175, 200, 0, YOU, "A") + car(68, 135, 90, OTHER, "B")
    },
    stop: {
      alt: "Carrefour. Votre véhicule bleu A est face à un panneau STOP. Le véhicule rouge B arrive sur la route qui croise la vôtre, par la gauche.",
      draw: () => crossroads() + `<rect x="160" y="156" width="30" height="4" fill="${WHITE}"/>` + car(175, 200, 0, YOU, "A") + car(70, 135, 90, OTHER, "B") + stopSign(204, 176)
    },
    cedez: {
      alt: "Carrefour. Votre véhicule bleu A est face à un panneau Cédez le passage. Le véhicule rouge B arrive par votre droite sur la route qui croise la vôtre.",
      draw: () => crossroads() + `<g stroke="${WHITE}" stroke-width="3" stroke-dasharray="6 5"><line x1="160" y1="157" x2="190" y2="157"/></g>` + car(175, 200, 0, YOU, "A") + car(250, 105, -90, OTHER, "B") + yieldSign(204, 176)
    },
    priorite: {
      alt: "Carrefour. Votre véhicule bleu A circule sur une route marquée par le panneau jaune en losange. Le véhicule rouge B arrive par la droite, face à un panneau Cédez le passage.",
      draw: () => crossroads() + car(175, 200, 0, YOU, "A") + car(252, 105, -90, OTHER, "B") + priorityDiamond(204, 176) + yieldSign(222, 78)
    },
    tourne_gauche: {
      alt: "Carrefour. Votre véhicule bleu A veut tourner à gauche. Le véhicule rouge B arrive en face et va tout droit.",
      draw: (id) => crossroads() + arrow("M175 180 C175 130 172 108 112 108", id) + car(175, 205, 0, YOU, "A") + car(146, 32, 180, OTHER, "B")
    },
    tourne_droite_pieton: {
      alt: "Carrefour. Votre véhicule bleu A veut tourner à droite. Un piéton s'engage sur le passage protégé de la rue dans laquelle vous tournez.",
      draw: (id) => crossroads() +
        [0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="222" y="${93 + i * 8.5}" width="22" height="5" fill="${WHITE}"/>`).join("") +
        arrow("M175 182 C175 150 180 136 214 136", id) + car(175, 205, 0, YOU, "A") + person(233, 112)
    },
    rond_point: {
      alt: "Rond-point avec un panneau Cédez le passage à l'entrée. Votre véhicule bleu A s'apprête à entrer. Le véhicule rouge B est déjà engagé dans le rond-point.",
      draw: () => roundaboutBase() + yieldSign(198, 194) + car(172, 210, 0, YOU, "A") + car(122, 152, 135, OTHER, "B")
    },
    pieton: {
      alt: "Route avec un passage pour piétons. Votre véhicule bleu A approche. Un piéton est sur le passage.",
      draw: () => verticalRoad("dashed") +
        Array.from({ length: 8 }, (_, i) => `<rect x="${123 + i * 10}" y="104" width="6" height="22" fill="${WHITE}"/>`).join("") +
        car(180, 190, 0, YOU, "A") + person(176, 115) + pedSign(214, 150)
    },
    ligne_continue: {
      alt: "Route à double sens avec une ligne blanche continue au centre. Votre véhicule bleu A suit un camion lent. Le véhicule rouge B arrive en face au loin.",
      draw: () => verticalRoad("continuous") + car(180, 200, 0, YOU, "A") + car(180, 112, 0, TRUCK, "C", true) + car(140, 18, 180, OTHER, "B")
    },
    ligne_discontinue: {
      alt: "Route à double sens avec une ligne blanche discontinue au centre. Votre véhicule bleu A suit un camion lent. La route est dégagée en face.",
      draw: () => verticalRoad("dashed") + car(180, 200, 0, YOU, "A") + car(180, 112, 0, TRUCK, "C", true)
    },
    passage_niveau: {
      alt: "Passage à niveau. Les feux rouges clignotent et les barrières sont baissées. Un train arrive. Votre véhicule bleu A est devant les barrières.",
      draw: () => `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="130" y="0" width="60" height="${H}" fill="${ROAD}"/>
        <line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>
        <rect x="0" y="96" width="${W}" height="28" fill="#8a7a66"/>
        <line x1="0" y1="102" x2="${W}" y2="102" stroke="#222" stroke-width="3"/><line x1="0" y1="118" x2="${W}" y2="118" stroke="#222" stroke-width="3"/>
        <g stroke="#3a3a3a" stroke-width="3">${Array.from({ length: 32 }, (_, i) => `<line x1="${i * 10 + 4}" y1="98" x2="${i * 10 + 4}" y2="122"/>`).join("")}</g>
        <rect x="14" y="98" width="86" height="22" rx="4" fill="#5c6670" stroke="#1d2126" stroke-width="2"/><rect x="20" y="102" width="12" height="9" fill="#cfe8ff"/>
        <g><rect x="160" y="134" width="40" height="6" fill="#fff" stroke="#d62430" stroke-width="1"/><rect x="120" y="80" width="40" height="6" fill="#fff" stroke="#d62430" stroke-width="1"/>
        <g fill="#d62430">${[0, 1, 2, 3].map((i) => `<rect x="${164 + i * 10}" y="134" width="5" height="6"/>`).join("")}${[0, 1, 2, 3].map((i) => `<rect x="${124 + i * 10}" y="80" width="5" height="6"/>`).join("")}</g></g>
        <circle cx="204" cy="150" r="6" fill="#ff3b30" stroke="#fff" stroke-width="1.5"/><circle cx="116" cy="70" r="6" fill="#ff3b30" stroke="#fff" stroke-width="1.5"/>` + car(175, 195, 0, YOU, "A")
    },
    feu_rouge: {
      alt: "Carrefour à feux. Le feu est rouge pour votre véhicule bleu A. Aucun autre véhicule n'est visible.",
      draw: () => crossroads() + `<rect x="160" y="158" width="30" height="5" fill="${WHITE}"/>` + car(175, 205, 0, YOU, "A") + trafficLight(206, 190, "red")
    },
    feu_orange: {
      alt: "Carrefour à feux. Le feu passe à l'orange pour votre véhicule bleu A, qui arrive à vitesse normale et peut encore s'arrêter sans danger avant la ligne.",
      draw: () => crossroads() + `<rect x="160" y="158" width="30" height="5" fill="${WHITE}"/>` + car(175, 214, 0, YOU, "A") + trafficLight(206, 190, "orange")
    },
    t_droite: {
      alt: "Intersection en T sans panneau. Votre véhicule bleu A arrive au bout de la route. Le véhicule rouge B arrive par votre droite sur la route transversale.",
      draw: () => tJunction() + car(175, 205, 0, YOU, "A") + car(252, 48, -90, OTHER, "B")
    }
  };

  window.sceneIds = Object.keys(scenes);

  window.sceneAlt = function (id) {
    return scenes[id] ? scenes[id].alt : "";
  };

  window.sceneSvg = function (id) {
    const s = scenes[id];
    if (!s) return "";
    const mid = "scene-ah-" + (++uid);
    return `<div class="scene-art" role="img" aria-label="${s.alt.replace(/"/g, "&quot;")}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true">${defs(mid)}${s.draw(mid)}</svg></div>`;
  };
})();
