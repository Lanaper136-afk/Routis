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

  // ================= Schémas supplémentaires (simulations) =================
  function veh(x, y, rot, w, h, color, label) {
    const lab = label ? `<g transform="rotate(${-rot})"><circle cx="0" cy="0" r="6.5" fill="#fff"/><text x="0" y="3.6" text-anchor="middle" font-size="10" font-weight="800" font-family="Arial,sans-serif" fill="#111">${label}</text></g>` : "";
    return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="5" fill="${color}" stroke="#101418" stroke-width="1.5"/><rect x="${-w / 2 + 2.5}" y="${-h / 2 + 3}" width="${w - 5}" height="6" rx="2" fill="#cfe8ff"/>${lab}</g>`;
  }
  function blink(x, y) { return `<circle cx="${x}" cy="${y}" r="3.2" fill="#ff9f0a" stroke="#fff" stroke-width="1"/>`; }
  function cone(x, y) { return `<g transform="translate(${x} ${y})"><circle r="5" fill="#ff7a00" stroke="#fff" stroke-width="1.5"/><circle r="2" fill="#fff"/></g>`; }
  function roadV(x0, w) { return `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="${x0}" y="0" width="${w}" height="${H}" fill="${ROAD}"/>`; }
  function sign30(x, y) {
    return `<g transform="translate(${x} ${y})"><rect x="-1.5" y="6" width="3" height="14" fill="#666"/><circle r="11" fill="#fff" stroke="#d62430" stroke-width="3.5"/><text x="0" y="4" text-anchor="middle" font-size="10" font-weight="800" font-family="Arial,sans-serif" fill="#111">30</text></g>`;
  }
  function zebraH(x, y, len) { return Array.from({ length: Math.floor(len / 10) }, (_, i) => `<rect x="${x + i * 10}" y="${y}" width="6" height="22" fill="${WHITE}"/>`).join(""); }

  Object.assign(scenes, {
    zone30: {
      alt: "Zone 30 : des voitures sont garées des deux côtés de la rue. Un piéton s'apprête à sortir entre deux voitures. Votre véhicule bleu A arrive.",
      draw: () => roadV(115, 90) + `<rect x="115" y="0" width="22" height="${H}" fill="#5d626c"/><rect x="183" y="0" width="22" height="${H}" fill="#5d626c"/>
        <line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>` +
        veh(126, 60, 0, 17, 32, "#8d99a6") + veh(126, 100, 0, 17, 32, "#c9a227") + veh(194, 85, 0, 17, 32, "#6b8e5a") + veh(194, 150, 0, 17, 32, "#8d99a6") +
        car(175, 205, 0, YOU, "A") + person(141, 126) + sign30(222, 175)
    },
    rond_point_sortie: {
      alt: "Rond-point avec un panneau Cédez le passage. Votre véhicule bleu A est à l'entrée. Le véhicule rouge B est dans l'anneau, juste avant votre entrée, et clignote à droite pour sortir.",
      draw: () => roundaboutBase() + yieldSign(198, 194) + car(172, 210, 0, YOU, "A") + car(130, 156, 135, OTHER, "B") + blink(137, 172)
    },
    depassement_virage: {
      alt: "Route en virage sans visibilité avec une ligne continue. Votre véhicule bleu A suit un tracteur agricole qui roule très lentement.",
      draw: () => `<rect width="${W}" height="${H}" fill="${GRASS}"/>
        <path d="M170 250 L170 140 Q170 50 250 50 L330 50" fill="none" stroke="${ROAD}" stroke-width="80"/>
        <path d="M170 250 L170 140 Q170 50 250 50 L330 50" fill="none" stroke="${WHITE}" stroke-width="3"/>
        <g fill="#2f6b2f"><circle cx="105" cy="60" r="18"/><circle cx="80" cy="95" r="15"/><circle cx="122" cy="100" r="13"/></g>` +
        car(188, 210, 0, YOU, "A") + veh(188, 150, 0, 20, 36, "#3d8b37", "") + `<rect x="181" y="158" width="14" height="12" rx="2" fill="#222"/>`
    },
    stationnement_passage: {
      alt: "Une place libre est visible sur le bord de la route, juste avant un passage piéton. Votre véhicule bleu A arrive.",
      draw: () => roadV(120, 80) + `<rect x="196" y="0" width="26" height="${H}" fill="#5d626c"/>
        <line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>` + zebraH(122, 78, 80) +
        veh(209, 200, 0, 18, 34, "#8d99a6") + `<rect x="199" y="108" width="20" height="38" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 4"/>
        <text x="209" y="132" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" font-family="Arial,sans-serif">?</text>
        <path d="M232 100 L232 146" stroke="#ffd43b" stroke-width="2.5"/><path d="M227 100 h10 M227 146 h10" stroke="#ffd43b" stroke-width="2.5"/>
        <text x="258" y="127" font-size="12" font-weight="800" fill="#fff" font-family="Arial,sans-serif" stroke="#222" stroke-width="3" paint-order="stroke">5 m</text>` +
        car(180, 195, 0, YOU, "A") + person(88, 90)
    },
    brouillard: {
      alt: "Route de nuit dans un brouillard épais. Votre véhicule bleu A roule avec ses feux ; la visibilité est très courte.",
      draw: () => `<rect width="${W}" height="${H}" fill="#1b2330"/><rect x="120" y="0" width="80" height="${H}" fill="#2d333d"/>
        <line x1="160" y1="0" x2="160" y2="${H}" stroke="#d9dde3" stroke-width="2" stroke-dasharray="9 8"/>
        <polygon points="170,172 150,90 200,90 182,172" fill="#ffe27a" opacity="0.45"/>` + car(176, 200, 0, YOU, "A") +
        `<circle cx="168" cy="224" r="3" fill="#ff3b30"/><circle cx="184" cy="224" r="3" fill="#ff3b30"/>
        <g fill="#e8edf2"><ellipse cx="160" cy="70" rx="120" ry="60" opacity="0.4"/><ellipse cx="100" cy="30" rx="110" ry="45" opacity="0.35"/><ellipse cx="240" cy="40" rx="90" ry="40" opacity="0.35"/><ellipse cx="160" cy="125" rx="100" ry="26" opacity="0.3"/></g>`
    },
    inter_droite_large: {
      alt: "Carrefour sans panneau. Votre véhicule bleu A arrive par le bas sur une route étroite. Un véhicule rouge B arrive par votre droite sur une route plus large.",
      draw: () => `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="140" y="0" width="40" height="${H}" fill="${ROAD}"/><rect x="0" y="75" width="${W}" height="90" fill="${ROAD}"/>
        <g stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"><line x1="0" y1="120" x2="134" y2="120"/><line x1="186" y1="120" x2="${W}" y2="120"/></g>` +
        car(166, 205, 0, YOU, "A") + car(252, 100, -90, OTHER, "B")
    },
    insertion: {
      alt: "Voie rapide avec une voie d'accélération. Votre véhicule bleu A arrive sur la voie d'accélération. Le véhicule rouge M circule déjà sur la voie de droite de la voie principale.",
      draw: () => `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="100" y="0" width="100" height="${H}" fill="${ROAD}"/>
        <polygon points="200,240 250,240 250,175 200,110" fill="${ROAD}"/>
        <line x1="150" y1="0" x2="150" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>
        <line x1="200" y1="0" x2="200" y2="110" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/><line x1="200" y1="110" x2="250" y2="175" stroke="${WHITE}" stroke-width="2"/>` +
        veh(226, 195, 0, 18, 34, YOU, "A") + car(176, 140, 0, OTHER, "M")
    },
    angle_mort: {
      alt: "Route à trois voies. Votre véhicule bleu A veut passer sur la voie de gauche. Une moto rouge est dans votre angle mort, à gauche, légèrement derrière vous.",
      draw: (id) => `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="75" y="0" width="170" height="${H}" fill="${ROAD}"/>
        <g stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"><line x1="132" y1="0" x2="132" y2="${H}"/><line x1="188" y1="0" x2="188" y2="${H}"/></g>
        <polygon points="160,125 100,170 100,215 160,215" fill="#ffd43b" opacity="0.28"/>` +
        arrow("M160 140 C160 110 108 120 104 70", id) + car(160, 150, 0, YOU, "A") + veh(104, 192, 0, 9, 22, OTHER, "")
    },
    bus: {
      alt: "Un bus à l'arrêt, clignotant gauche allumé, s'apprête à repartir. Votre véhicule bleu A arrive derrière lui.",
      draw: () => roadV(120, 80) + `<rect x="196" y="95" width="26" height="70" fill="#5d626c"/><rect x="224" y="105" width="22" height="42" rx="3" fill="#e9ecef" stroke="#222" stroke-width="1.5"/>
        <line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>` +
        veh(180, 130, 0, 22, 64, "#1769e0", "") + blink(171, 163) + car(180, 205, 0, "#c9ced6", "A").replace("#c9ced6", YOU)
    },
    prioritaire: {
      alt: "Carrefour à feux. Le feu est vert pour votre véhicule bleu A. Un camion de pompiers arrive de la gauche, gyrophares allumés.",
      draw: () => crossroads() + car(175, 205, 0, YOU, "A") + trafficLight(206, 190, "green") +
        veh(88, 135, 90, 22, 62, "#d62430", "") + `<circle cx="116" cy="130" r="3.5" fill="#3aa0ff"/><circle cx="116" cy="140" r="3.5" fill="#3aa0ff"/><circle cx="60" cy="132" r="3" fill="#3aa0ff"/>`
    },
    distance: {
      alt: "Autoroute. Votre véhicule bleu A suit le véhicule rouge B. Un repère indique la distance de sécurité à garder entre les deux.",
      draw: () => `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="90" y="0" width="140" height="${H}" fill="${ROAD}"/>
        <g stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"><line x1="137" y1="0" x2="137" y2="${H}"/><line x1="183" y1="0" x2="183" y2="${H}"/></g>` +
        car(160, 205, 0, YOU, "A") + car(160, 50, 0, OTHER, "B") +
        `<path d="M200 187 L200 68" stroke="#ffd43b" stroke-width="3"/><path d="M193 187 h14 M193 68 h14" stroke="#ffd43b" stroke-width="3"/><text x="214" y="132" font-size="22" font-weight="800" fill="#fff" stroke="#222" stroke-width="3" paint-order="stroke" font-family="Arial,sans-serif">?</text>`
    },
    cycliste: {
      alt: "Carrefour. Votre véhicule bleu A veut tourner à droite. Un cycliste roule sur la bande cyclable à votre droite et continue tout droit.",
      draw: (id) => crossroads() + `<rect x="188" y="150" width="9" height="100" fill="#3a7f4d" opacity="0.9"/>` +
        arrow("M170 182 C170 150 176 138 232 136", id) + car(170, 207, 0, YOU, "A") +
        `<g transform="translate(192.5 195)"><rect x="-2" y="-9" width="4" height="18" rx="2" fill="#222"/><circle r="4.5" cy="-1" fill="#e8a000" stroke="#222" stroke-width="1"/></g>`
    },
    accident: {
      alt: "Un accident vient d'avoir lieu : deux voitures sont immobilisées en travers de la route, l'une avec les feux de détresse. Votre véhicule bleu A, arrivé en premier, s'arrête en sécurité.",
      draw: () => roadV(120, 80) + `<line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>` +
        veh(168, 85, 25, 18, 34, "#8d99a6", "") + veh(148, 62, 160, 18, 34, "#c9a227", "") + blink(176, 102) + blink(160, 100) +
        `<polygon points="176,150 168,166 184,166" fill="#fff" stroke="#d62430" stroke-width="3"/>` + car(185, 214, 0, YOU, "A") + blink(177, 229) + blink(193, 229) + person(214, 190)
    },
    agent: {
      alt: "Carrefour à feux. Le feu est rouge pour votre véhicule bleu A, mais un agent de police placé au centre vous fait signe d'avancer.",
      draw: () => crossroads() + `<rect x="160" y="158" width="30" height="5" fill="${WHITE}"/>` + car(175, 210, 0, YOU, "A") + trafficLight(206, 190, "red") +
        `<g transform="translate(160 128)"><line x1="-16" y1="0" x2="16" y2="0" stroke="#1d3f8f" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-14" stroke="#1d3f8f" stroke-width="5" stroke-linecap="round"/><circle r="7" fill="#1d3f8f" stroke="#fff" stroke-width="1.5"/><circle cy="0" r="3" fill="#f2c9a0"/></g>`
    },
    pieton_trottoir: {
      alt: "Passage piéton sans feu. Un piéton, sur le trottoir, avance vers la chaussée pour traverser. Votre véhicule bleu A approche.",
      draw: () => roadV(120, 80) + `<rect x="60" y="0" width="60" height="${H}" fill="#b9bcc2"/>
        <line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>` + zebraH(122, 104, 80) +
        car(180, 196, 0, YOU, "A") + person(112, 115) + pedSign(228, 150)
    },
    sortie_parking: {
      alt: "Votre véhicule bleu A sort d'un parking privé pour s'engager sur la route. Le véhicule rouge B arrive sur la route par la gauche, dans le sens opposé à droite.",
      draw: () => `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="110" y="0" width="80" height="${H}" fill="${ROAD}"/><line x1="150" y1="0" x2="150" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>
        <rect x="190" y="95" width="130" height="90" fill="#8f949c"/><g stroke="#fff" stroke-width="1.5"><line x1="230" y1="100" x2="230" y2="125"/><line x1="260" y1="100" x2="260" y2="125"/><line x1="290" y1="100" x2="290" y2="125"/></g>` +
        veh(222, 140, -90, 18, 34, YOU, "A") + car(130, 205, 0, OTHER, "B")
    },
    zfe: {
      alt: "Entrée d'une ville par une route. Un panneau Zone à faibles émissions est visible. Le pare-brise de votre véhicule bleu A porte une vignette Crit'Air.",
      draw: () => roadV(120, 80) + `<line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>
        <g fill="#9aa3ad" stroke="#6c747d"><rect x="215" y="10" width="60" height="50"/><rect x="215" y="70" width="60" height="40"/><rect x="30" y="20" width="60" height="55"/><rect x="30" y="85" width="60" height="40"/></g>
        <g transform="translate(222 160)"><rect x="-1.5" y="12" width="3" height="22" fill="#666"/><rect x="-26" y="-14" width="52" height="28" rx="3" fill="#fff" stroke="#1769e0" stroke-width="3"/><text x="0" y="5" text-anchor="middle" font-size="13" font-weight="800" fill="#1769e0" font-family="Arial,sans-serif">ZFE</text></g>` +
        car(180, 200, 0, YOU, "A") + `<circle cx="180" cy="187" r="4.5" fill="#34c759" stroke="#fff" stroke-width="1"/>`
    },
    chantier_feux: {
      alt: "Chantier : la route est réduite à une voie par des cônes et régulée par un feu rouge temporaire. Votre véhicule bleu A est arrêté devant le feu.",
      draw: () => roadV(120, 80) + `<line x1="160" y1="0" x2="160" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>` +
        [40, 62, 84, 106].map((y) => cone(150, y)).join("") + `<rect x="122" y="30" width="26" height="90" fill="#d9a400" opacity="0.5"/>` +
        `<rect x="160" y="150" width="40" height="4" fill="${WHITE}"/>` + car(180, 196, 0, YOU, "A") + trafficLight(214, 172, "red") +
        `<g transform="translate(106 150)"><rect x="-1.5" y="6" width="3" height="14" fill="#666"/><polygon points="0,-11 11,0 0,11 -11,0" fill="#ffd43b" stroke="#222" stroke-width="1.5"/></g>`
    },
    panne_autoroute: {
      alt: "Autoroute. Votre véhicule bleu A est en panne, arrêté sur la bande d'arrêt d'urgence, feux de détresse allumés. D'autres véhicules passent sur les voies de circulation.",
      draw: () => `<rect width="${W}" height="${H}" fill="${GRASS}"/><rect x="90" y="0" width="130" height="${H}" fill="${ROAD}"/><rect x="190" y="0" width="30" height="${H}" fill="#5a5f69"/>
        <line x1="190" y1="0" x2="190" y2="${H}" stroke="${WHITE}" stroke-width="3"/><line x1="140" y1="0" x2="140" y2="${H}" stroke="${WHITE}" stroke-width="2" stroke-dasharray="9 8"/>
        <line x1="232" y1="0" x2="232" y2="${H}" stroke="#aeb4bc" stroke-width="5"/>` +
        car(115, 80, 0, OTHER, "") + car(165, 40, 0, "#c9a227", "") + veh(205, 160, 0, 18, 34, YOU, "A") + blink(197, 190) + blink(213, 190) + blink(197, 130) + blink(213, 130) +
        `<g transform="translate(262 160)"><circle r="7" fill="#ffd400" stroke="#222" stroke-width="1.5"/><circle r="3" fill="#f2c9a0"/></g>`
    },
    siege_enfant: {
      alt: "Vue de dessus d'une voiture : un enfant de 8 ans est installé sur la banquette arrière, sur un réhausseur, avec la ceinture.",
      draw: () => `<rect width="${W}" height="${H}" fill="#eaf1fc"/><g transform="translate(160 112) scale(.88)"><rect x="-55" y="-105" width="110" height="210" rx="30" fill="#e5e9ef" stroke="#101418" stroke-width="3"/>
        <rect x="-45" y="-82" width="90" height="34" rx="8" fill="#cfe8ff"/>
        <rect x="-42" y="-30" width="34" height="38" rx="8" fill="#6b7480"/><rect x="8" y="-30" width="34" height="38" rx="8" fill="#6b7480"/>
        <rect x="-44" y="30" width="88" height="50" rx="10" fill="#8a93a0"/>
        <rect x="-26" y="40" width="34" height="26" rx="5" fill="#1769e0"/><circle cx="-9" cy="53" r="11" fill="#f2c9a0" stroke="#222" stroke-width="1.5"/>
        <path d="M-27 34 L5 72" stroke="#ffd43b" stroke-width="3.5"/></g>
        <text x="160" y="232" text-anchor="middle" font-size="12" font-weight="700" fill="#2a3340" font-family="Arial,sans-serif">Réhausseur + ceinture</text>`
    }
  });

  // ================= Figures pédagogiques (fiches de cours) =================
  function T(fr, en) { return (typeof getLang === "function" && getLang() === "en") ? en : fr; }
  const FONT = 'font-family="Arial,sans-serif"';
  function txt(x, y, s, size, weight, fill, anchor) {
    return `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" font-size="${size || 11}" font-weight="${weight || 700}" fill="${fill || "#16212f"}" ${FONT}>${s}</text>`;
  }

  Object.assign(scenes, {
    fig_arret: {
      w: 320, h: 190,
      alt: "Schéma : distances de réaction et de freinage à 50, 90 et 130 kilomètres par heure.",
      get altDyn() { return T("Schéma : distance de réaction et distance de freinage à 50, 90 et 130 km/h.", "Diagram: reaction distance and braking distance at 50, 90 and 130 km/h."); },
      draw: () => {
        const rows = [[50, 14, 14], [90, 25, 50], [130, 36, 105]];
        const k = 1.35, x0 = 62;
        let out = `<rect width="320" height="190" fill="#fff"/>`;
        out += `<rect x="62" y="12" width="12" height="10" fill="#f59f00"/>` + txt(78, 21, T("Réaction (≈ 1 s)", "Reaction (≈ 1 s)"), 10, 700, "#16212f", "start");
        out += `<rect x="178" y="12" width="12" height="10" fill="#d62430"/>` + txt(194, 21, T("Freinage (route sèche)", "Braking (dry road)"), 10, 700, "#16212f", "start");
        rows.forEach(([v, r, f], i) => {
          const y = 42 + i * 50;
          out += txt(8, y + 20, v + " km/h", 12, 800, "#16212f", "start");
          out += `<rect x="${x0}" y="${y}" width="${r * k}" height="26" fill="#f59f00"/><rect x="${x0 + r * k}" y="${y}" width="${f * k}" height="26" fill="#d62430"/>`;
          out += txt(x0 + (r + f) * k + 6, y + 18, "≈ " + (r + f) + " m", 12, 800, "#16212f", "start");
        });
        out += txt(160, 184, T("Distance d'arrêt = réaction + freinage", "Stopping distance = reaction + braking"), 10.5, 700, "#607086");
        return out;
      }
    },
    fig_lignes: {
      w: 320, h: 200,
      get altDyn() { return T("Schéma : ligne continue (interdit de franchir), ligne discontinue (franchissable) et ligne d'avertissement à traits rapprochés.", "Diagram: solid line (no crossing), dashed line (may be crossed) and warning line with close dashes."); },
      alt: "Schéma : ligne continue, ligne discontinue et ligne d'avertissement.",
      draw: () => {
        let o = `<rect width="320" height="200" fill="#fff"/>`;
        const strips = [[10, "c", T("Continue", "Solid"), T("interdit de franchir", "no crossing")], [115, "d", T("Discontinue", "Dashed"), T("franchissable", "may be crossed")], [220, "w", T("Rapprochée", "Close dashes"), T("annonce une continue", "warns of a solid line")]];
        strips.forEach(([x, kind, a, b]) => {
          o += `<rect x="${x}" y="8" width="90" height="136" rx="6" fill="${ROAD}"/>`;
          const cx = x + 45;
          if (kind === "c") o += `<line x1="${cx}" y1="8" x2="${cx}" y2="144" stroke="#fff" stroke-width="4"/>`;
          if (kind === "d") o += `<line x1="${cx}" y1="8" x2="${cx}" y2="144" stroke="#fff" stroke-width="4" stroke-dasharray="22 16"/>`;
          if (kind === "w") o += `<line x1="${cx}" y1="8" x2="${cx}" y2="144" stroke="#fff" stroke-width="4" stroke-dasharray="7 6"/>`;
          o += txt(cx, 164, a, 12, 800) + txt(cx, 180, b, 9.5, 600, "#607086");
        });
        return o;
      }
    },
    fig_depasse_cycliste: {
      w: 320, h: 220,
      alt: "Schéma : une voiture dépasse un cycliste en laissant une distance latérale de 1 mètre en agglomération et 1,5 mètre hors agglomération.",
      get altDyn() { return T("Schéma : une voiture dépasse un cycliste avec une distance latérale de 1 m en agglomération, 1,5 m hors agglomération.", "Diagram: a car overtakes a cyclist leaving 1 m in built-up areas and 1.5 m outside."); },
      draw: () => `<rect width="320" height="220" fill="${GRASS}"/><rect x="70" y="0" width="180" height="220" fill="${ROAD}"/>
        <line x1="130" y1="0" x2="130" y2="220" stroke="#fff" stroke-width="2.5" stroke-dasharray="14 12"/>` +
        veh(105, 135, 0, 20, 36, YOU, "A") +
        `<g transform="translate(205 120)"><rect x="-2.5" y="-14" width="5" height="28" rx="2.5" fill="#222"/><circle r="6" cy="-1" fill="#e8a000" stroke="#222" stroke-width="1.3"/></g>
        <path d="M118 80 L196 80" stroke="#ffd43b" stroke-width="3"/><path d="M118 73 v14 M196 73 v14" stroke="#ffd43b" stroke-width="3"/>` +
        txt(160, 46, T("Distance latérale minimale", "Minimum side gap"), 11, 800, "#fff").replace("<text", '<text stroke="#222" stroke-width="3" paint-order="stroke"') +
        txt(160, 62, T("1 m en agglomération", "1 m in built-up areas"), 11, 700, "#fff").replace("<text", '<text stroke="#222" stroke-width="3" paint-order="stroke"') +
        txt(160, 205, T("1,5 m hors agglomération", "1.5 m outside built-up areas"), 11, 700, "#fff").replace("<text", '<text stroke="#222" stroke-width="3" paint-order="stroke"')
    },
    fig_angle_mort_pl: {
      w: 320, h: 240,
      alt: "Schéma vu de dessus d'un poids lourd avec ses angles morts : le côté droit, l'arrière et l'avant de la cabine. Un cycliste se trouve dans l'angle mort à droite.",
      get altDyn() { return T("Schéma vu de dessus : les angles morts d'un poids lourd (côté droit, arrière, devant la cabine). Un cycliste est dans l'angle mort à droite.", "Top view: a truck's blind spots (right side, rear, in front of the cab). A cyclist is in the blind spot on the right."); },
      draw: () => `<rect width="320" height="240" fill="${ROAD}"/><line x1="160" y1="0" x2="160" y2="240" stroke="#fff" stroke-width="2" stroke-dasharray="12 10" opacity=".0"/>
        <g fill="#ff3b30" opacity=".32"><rect x="182" y="58" width="48" height="140"/><rect x="104" y="22" width="30" height="62"/><rect x="134" y="198" width="52" height="40"/><rect x="134" y="10" width="52" height="30"/></g>
        <rect x="140" y="48" width="42" height="150" rx="5" fill="#f1f3f5" stroke="#101418" stroke-width="2"/><rect x="142" y="42" width="38" height="34" rx="6" fill="#dfe3e8" stroke="#101418" stroke-width="2"/><rect x="146" y="46" width="30" height="9" rx="2" fill="#cfe8ff"/>
        <g transform="translate(206 150)"><rect x="-2.5" y="-14" width="5" height="28" rx="2.5" fill="#222"/><circle r="6" cy="-1" fill="#e8a000" stroke="#222" stroke-width="1.3"/></g>` +
        txt(160, 228, "", 10) + txt(262, 128, T("Angle mort", "Blind spot"), 11, 800, "#fff").replace("<text", '<text stroke="#222" stroke-width="3" paint-order="stroke"') +
        txt(262, 143, T("à droite", "on the right"), 10, 700, "#fff").replace("<text", '<text stroke="#222" stroke-width="3" paint-order="stroke"')
    },
    fig_chargement: {
      w: 320, h: 170,
      alt: "Schéma vu de côté : une voiture transporte une longue charge qui dépasse à l'arrière ; au-delà de 1 mètre, la charge doit être signalée par un panneau rouge et blanc.",
      get altDyn() { return T("Schéma de côté : une charge dépasse à l'arrière d'une voiture ; au-delà d'1 m, elle doit être signalée (panneau rouge et blanc).", "Side view: a load sticks out from the back of a car; beyond 1 m it must be flagged (red and white panel)."); },
      draw: () => `<rect width="320" height="170" fill="#eaf1fc"/><rect y="128" width="320" height="42" fill="${ROAD}"/>
        <rect x="40" y="82" width="140" height="42" rx="12" fill="${YOU}" stroke="#101418" stroke-width="2"/><rect x="70" y="64" width="70" height="30" rx="9" fill="#cfe8ff" stroke="#101418" stroke-width="2"/>
        <circle cx="76" cy="126" r="13" fill="#222"/><circle cx="148" cy="126" r="13" fill="#222"/><circle cx="76" cy="126" r="5" fill="#bbb"/><circle cx="148" cy="126" r="5" fill="#bbb"/>
        <rect x="104" y="96" width="156" height="9" fill="#9a6b3a" stroke="#101418" stroke-width="1.5"/>
        <g transform="translate(262 92)"><rect x="0" y="0" width="34" height="26" fill="#fff" stroke="#d62430" stroke-width="2"/><path d="M0 26 L9 0 M9 26 L18 0 M18 26 L27 0 M27 26 L34 3" stroke="#d62430" stroke-width="5"/></g>
        <path d="M184 150 L260 150" stroke="#ffd43b" stroke-width="3"/><path d="M184 143 v14 M260 143 v14" stroke="#ffd43b" stroke-width="3"/>` +
        txt(222, 142, T("plus d'1 m", "over 1 m"), 11, 800, "#fff").replace("<text", '<text stroke="#222" stroke-width="3" paint-order="stroke"') + txt(160, 18, T("Charge qui dépasse : à signaler", "Overhanging load: must be flagged"), 12, 800)
    },
    fig_triangle: {
      w: 320, h: 240,
      alt: "Schéma : une voiture en panne, feux de détresse allumés, avec un triangle de présignalisation posé au moins 30 mètres derrière elle.",
      get altDyn() { return T("Schéma : voiture en panne, feux de détresse, triangle posé à au moins 30 m derrière elle.", "Diagram: broken-down car with hazard lights and a warning triangle placed at least 30 m behind it."); },
      draw: () => `<rect width="320" height="240" fill="${GRASS}"/><rect x="100" y="0" width="120" height="240" fill="${ROAD}"/><line x1="160" y1="0" x2="160" y2="240" stroke="#fff" stroke-width="2" stroke-dasharray="12 10"/>` +
        veh(193, 62, 0, 20, 36, YOU, "") + blink(185, 44) + blink(201, 44) + blink(185, 80) + blink(201, 80) +
        `<polygon points="193,152 183,172 203,172" fill="#fff" stroke="#d62430" stroke-width="4" stroke-linejoin="round"/>
        <path d="M244 86 L244 166" stroke="#ffd43b" stroke-width="3"/><path d="M237 86 h14 M237 166 h14" stroke="#ffd43b" stroke-width="3"/>` +
        txt(262, 130, T("30 m", "30 m"), 14, 800, "#fff", "start").replace("<text", '<text stroke="#222" stroke-width="3" paint-order="stroke"') +
        txt(262, 146, T("au moins", "at least"), 10, 700, "#fff", "start").replace("<text", '<text stroke="#222" stroke-width="3" paint-order="stroke"') +
        `<g transform="translate(240 60)"><circle r="7" fill="#ffd400" stroke="#222" stroke-width="1.5"/><circle r="3" fill="#f2c9a0"/></g>` + veh(130, 222, 0, 20, 36, OTHER, "")
    },
    fig_pas: {
      w: 320, h: 170,
      alt: "Schéma : le réflexe PAS en trois étapes : Protéger, Alerter, Secourir.",
      get altDyn() { return T("Schéma : le réflexe PAS en trois étapes : Protéger, Alerter, Secourir.", "Diagram: the three-step reflex: Protect, Alert, Help."); },
      draw: () => {
        const items = [[55, "P", T("Protéger", "Protect"), T("balisage, gilet,", "warn others,"), T("danger écarté", "remove danger"), "#168357"], [160, "A", T("Alerter", "Alert"), "15 · 18 · 112", T("lieu, nombre de victimes", "place, no. of victims"), "#1769e0"], [265, "S", T("Secourir", "Help"), T("gestes de premiers", "first-aid"), T("secours", "gestures"), "#d62430"]];
        let o = `<rect width="320" height="170" fill="#fff"/>`;
        items.forEach(([x, l, a, b, c, col]) => {
          o += `<circle cx="${x}" cy="48" r="34" fill="${col}"/>` + txt(x, 62, l, 40, 900, "#fff") + txt(x, 105, a, 14, 800) + txt(x, 123, b, 10.5, 600, "#607086") + txt(x, 137, c, 10.5, 600, "#607086");
        });
        o += `<path d="M92 48 h28 M197 48 h28" stroke="#9aa5b4" stroke-width="3"/><path d="M118 41 l8 7 l-8 7 M223 41 l8 7 l-8 7" fill="none" stroke="#9aa5b4" stroke-width="3"/>`;
        return o;
      }
    }
  });

  Object.assign(scenes, {
    fig_alcool: {
      w: 320, h: 210,
      alt: "Schéma : taux d'alcoolémie. Conducteur confirmé : autorisé jusqu'à 0,5 g/L, contravention de 0,5 à 0,8, délit à partir de 0,8. Permis probatoire : autorisé jusqu'à 0,2 g/L.",
      get altDyn() { return T("Schéma : conducteur confirmé, autorisé jusqu'à 0,5 g/L, contravention de 0,5 à 0,8, délit à partir de 0,8 g/L ; permis probatoire autorisé jusqu'à 0,2 g/L.", "Diagram: experienced driver allowed up to 0.5 g/L, offence from 0.5 to 0.8, criminal offence from 0.8 g/L; probationary licence allowed up to 0.2 g/L."); },
      draw: () => {
        const x0 = 20, sc = 250 / 1.0; // 0 à 1,0 g/L
        const X = (v) => x0 + v * sc;
        const bar = (y, limit) => `<rect x="${X(0)}" y="${y}" width="${(limit) * sc}" height="26" fill="#2fa36b"/><rect x="${X(limit)}" y="${y}" width="${(0.8 - limit) * sc}" height="26" fill="#f08a24"/><rect x="${X(0.8)}" y="${y}" width="${0.2 * sc}" height="26" fill="#d62430"/>`;
        let o = `<rect width="320" height="210" fill="#fff"/>`;
        o += txt(20, 20, T("Conducteur confirmé", "Experienced driver"), 12, 800, "#16212f", "start") + bar(28, 0.5);
        o += txt(20, 88, T("Permis probatoire / transports en commun", "Probationary licence / public transport"), 12, 800, "#16212f", "start") + bar(96, 0.2);
        // graduation
        [[0, "0"], [0.2, "0,2"], [0.5, "0,5"], [0.8, "0,8"]].forEach(([v, l]) => {
          o += `<line x1="${X(v)}" y1="26" x2="${X(v)}" y2="136" stroke="#16212f" stroke-width="1" stroke-dasharray="3 3" opacity=".45"/>` + txt(X(v), 152, l, 12, 800);
        });
        o += txt(X(1.0) + 6, 152, "g/L", 11, 700, "#607086", "start");
        // légende
        o += `<rect x="20" y="168" width="12" height="12" fill="#2fa36b"/>` + txt(36, 178, T("Autorisé", "Allowed"), 11, 700, "#16212f", "start");
        o += `<rect x="92" y="168" width="12" height="12" fill="#f08a24"/>` + txt(108, 178, T("Contravention · 6 pts", "Offence · 6 pts"), 11, 700, "#16212f", "start");
        o += `<rect x="236" y="168" width="12" height="12" fill="#d62430"/>` + txt(252, 178, T("Délit", "Crime"), 11, 700, "#16212f", "start");
        o += txt(160, 202, T("0,5 g/L de sang = 0,25 mg/L d'air expiré", "0.5 g/L of blood = 0.25 mg/L of exhaled air"), 10, 600, "#607086");
        return o;
      }
    },
    fig_points: {
      w: 320, h: 230,
      alt: "Schéma : nombre de points retirés par infraction : excès de 20 à 30 km/h, 2 points ; téléphone tenu en main ou ceinture, 3 points ; feu rouge ou STOP, 4 points ; alcool entre 0,5 et 0,8 g/L ou excès de 50 km/h ou plus, 6 points. Capital de 12 points.",
      get altDyn() { return T("Schéma : points retirés par infraction, sur un capital de 12 points : excès de 20 à 30 km/h 2 points ; téléphone ou ceinture 3 points ; feu rouge ou STOP 4 points ; alcool 0,5 à 0,8 g/L ou excès de 50 km/h et plus 6 points.", "Diagram: points removed per offence out of 12: speeding 20–30 km/h over 2; phone or seat belt 3; red light or stop sign 4; alcohol 0.5–0.8 g/L or speeding 50 km/h over and more 6."); },
      draw: () => {
        const rows = [[T("Excès de 20 à 30 km/h", "Speeding 20–30 km/h over"), 2], [T("Téléphone tenu en main", "Handheld phone"), 3], [T("Ceinture non attachée", "No seat belt"), 3], [T("Feu rouge ou STOP", "Red light or stop sign"), 4], [T("Alcool de 0,5 à 0,8 g/L", "Alcohol 0.5–0.8 g/L"), 6], [T("Excès de 50 km/h ou plus", "Speeding 50 km/h over or more"), 6]];
        const x0 = 150, u = 14;
        let o = `<rect width="320" height="230" fill="#fff"/>` + txt(20, 18, T("Points retirés (capital : 12)", "Points removed (total: 12)"), 12, 800, "#16212f", "start");
        rows.forEach(([l, n], i) => {
          const y = 30 + i * 32;
          o += txt(8, y + 17, l, 10.5, 700, "#16212f", "start");
          o += Array.from({ length: n }, (_, k) => `<rect x="${x0 + k * (u + 3)}" y="${y}" width="${u}" height="22" rx="3" fill="${n >= 6 ? "#d62430" : n >= 4 ? "#f08a24" : "#f2b705"}"/>`).join("") + txt(x0 + n * (u + 3) + 6, y + 17, "−" + n, 12, 800, "#16212f", "start");
        });
        return o;
      }
    }
  });

  window.sceneIds = Object.keys(scenes);

  window.sceneAlt = function (id) {
    const s = scenes[id];
    return s ? (s.altDyn || s.alt) : "";
  };

  window.sceneSvg = function (id) {
    const s = scenes[id];
    if (!s) return "";
    const mid = "scene-ah-" + (++uid);
    const w = s.w || W, h = s.h || H;
    const alt = (s.altDyn || s.alt).replace(/"/g, "&quot;");
    return `<div class="scene-art" role="img" aria-label="${alt}"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true">${defs(mid)}${s.draw(mid)}</svg></div>`;
  };
})();
