import { seedFrom } from './utils';

/**
 * The permanent public identifier for every National 5 variation.
 *
 * A shared worksheet link carries a variation and a seed and regenerates the
 * question from the pair. So whatever names the variation in that link is a
 * public identifier with the lifetime of the links themselves, which — to
 * anyone who has pasted one into a homework — is forever.
 *
 * **Not its position in the registry.** Inserting a variation would shift
 * every later one and silently repoint every old link at a different question.
 * That is the failure this file exists to prevent.
 *
 * **Not the variation id either**, stable though that is: the ids run to 38
 * characters, and ten of those in a URL is 400 characters of link. Five base36
 * characters addresses 60 million, and all 234 ids land on distinct ones.
 *
 * ## The rule
 *
 * **An entry may be added. It may never be changed or removed.**
 *
 * A changed code breaks nothing visible. Nothing fails to compile, no check
 * downstream goes red, and the link still resolves — to a different question
 * from the one the teacher set. That is why the rule is enforced here rather
 * than left to whoever reads the diff.
 *
 * `__checks__/codes.ts` enforces it mechanically: every code must equal
 * `codeFor(id)`, so an arbitrary edit fails. Renaming a variation id changes
 * what `codeFor` derives — which is exactly the case that must not quietly
 * repoint a link — so a rename **keeps the old code** and says why in
 * `CODE_EXCEPTIONS`.
 *
 * Warm-up variations have codes too, though only exam-tier ones are offered on
 * the website. Assigning them now costs nothing and means the day warm-ups are
 * exposed is not the day 37 new public identifiers get minted.
 */
export function codeFor(id: string): string {
  // FNV-1a, the same hash `withSeed` uses for string seeds, reduced to five
  // base36 digits. Deterministic and dependency-free: the code for an id is
  // the same in a browser, in a check and on the build machine.
  return (seedFrom(id) % 36 ** 5).toString(36).padStart(5, '0');
}

/** Variation id to its permanent code. Append only — see the rule above. */
export const VARIATION_CODES: Record<string, string> = {
  'fractions.add':                          's0vc1',
  'fractions.subtract':                     'o70v2',
  'fractions.add-mixed':                    'xqt6z',
  'fractions.subtract-mixed':               '7zgoc',
  'fractions.multiply':                     '72hve',
  'fractions.multiply-mixed':               'lbw6g',
  'fractions.divide':                       '978pz',
  'fractions.divide-mixed':                 'r6fs9',
  'fractions.brackets':                     '2cic3',
  'fractions.three-term':                   'fv42v',
  'fractions.context':                      'nfc79',

  'surds.simplify':                         'y36lx',
  'surds.add':                              'tgjn5',
  'surds.subtract':                         'p7oha',
  'surds.multiply':                         '1kvu2',
  'surds.divide':                           'fawhj',
  'surds.rationalise':                      '8ayg7',
  'surds.expand-bracket':                   '6cs1r',
  'surds.in-function':                      'mo3gw',
  'surds.sum-three':                        'n76rk',
  'surds.rationalise-simplify':             'pk9u9',
  'surds.rationalise-quotient':             '27iyj',

  'indices.laws':                           'nc7c5',
  'indices.negative-power':                 'faczv',
  'indices.evaluate':                       'gd0t3',
  'indices.coefficient':                    'a2t9h',
  'indices.coefficient-quotient':           '63lcd',
  'indices.expand':                         'fdkfo',
  'indices.cancel-coefficients':            'dhopj',
  'indices.root-denominator':               'x24ht',
  'indices.root-as-power':                  'nz5nj',

  'percentages.compound':                   'ndvrl',
  'percentages.compound-between-years':     'frk33',
  'percentages.reverse':                    'l3vuq',
  'percentages.part-of-whole':              'df9o3',
  'percentages.surcharge':                  '69oba',
  'percentages.change':                     '93rqc',
  'percentages.two-stage':                  'unb4x',

  'expanding.single':                       'lmjh7',
  'expanding.two-singles':                  '7evsr',
  'expanding.monomial':                     '48vij',
  'expanding.two-binomials':                '8ifho',
  'expanding.binomial-trinomial':           'il2ma',
  'expanding.product-plus':                 'nqpad',

  'factorising.common-factor':              'kb3xb',
  'factorising.difference-squares':         'y0yrq',
  'factorising.trinomial-simple':           'ff7pe',
  'factorising.trinomial-hard':             'og02d',
  'factorising.fully':                      '82z24',
  'factorising.solve':                      'ckl3f',
  'factorising.solve-non-unitary':          'exjlo',

  'quadratics.complete-square':             'oiub9',
  'quadratics.turning-point-related':       '0cvdk',
  'quadratics.turning-point':               'nfmve',
  'quadratics.complete-square-surd-roots':  'd13b6',

  'straight-line.best-fit':                 '7utb6',
  'straight-line.best-fit-grid':            'csnzt',
  'straight-line.from-marked-points':       'qp96z',

  'trig-graphs.amplitude-cycles':           'dh68k',
  'trig-graphs.shift':                      'e84j9',
  'trig-graphs.shift-and-raise':            'j6f1w',
  'trig-graphs.turning-point':              'n9ay3',

  'quadratics.sketch-completed-square':     'nzu4k',
  'quadratics.sketch-factorised':           'diz6l',
  'quadratics.parabola-scale':              'vz109',
  'quadratics.parabola-from-turning-point': '92zyq',
  'quadratics.parabola-with-axis':          'xszd1',
  'quadratics.parabola-y-intercept':        '86p0j',
  'quadratics.parabola-from-axis':          '4dvap',
  'quadratics.parabola-maximum':            '7vl1l',
  'quadratics.reaches-height':              'ckqnd',
  'quadratics.lands-below':                 'pu5ky',
  'quadratics.discriminant':                '8ujo9',
  'quadratics.formula':                     '36o1u',

  'alg-fractions.simplify':                 'cc9m4',
  'alg-fractions.factorise-simplify':       '51w4p',
  'alg-fractions.add':                      '8n26a',
  'alg-fractions.subtract':                 '6frg3',
  'alg-fractions.divide-squares-on-top':    '1zymt',
  'alg-fractions.multiply':                 'arqh3',
  'alg-fractions.divide':                   'fotq6',
  'alg-fractions.divide-simple':            'hq5x7',
  'alg-fractions.gradient-context':         '019pp',

  'change-subject.fraction':                'znmhk',
  'change-subject.fraction-two-step':       'hr5uk',
  'change-subject.root':                    't28fq',
  'change-subject.root-two-step':           'fiqhm',
  'change-subject.fraction-coefficient':    '0ddl4',

  'inequalities.brackets':                  'jmj4x',
  'inequalities.fractions':                 'cxfvr',

  'simeq.solve-given':                      'wg43j',
  'simeq.intersection':                     '80x6l',
  'simeq.construct-solve':                  'x1gsz',
  'simeq.construct-combine':                'sqtw9',

  'functions.evaluate':                     'f9ts3',
  'functions.find-unknown':                 'rg8f4',
  'functions.evaluate-then-solve':          'vg7vf',
  'functions.evaluate-trig':                'v8v0s',

  'data.quartiles':                         'mg3gd',
  'data.median-iqr-compare':                's5o08',
  'data.mean-sd-consistency':               '7elwh',
  'data.mean-sd':                           '73bao',
  'data.mean-sd-compare':                   'k88uu',
  'data.sd-surd':                           'briyn',
  'data.sd-find-a':                         '90h2w',

  'trig-equations.solve':                   'owldc',
  'trig-equations.in-formula':              'ha1pd',
  'trig-equations.in-formula-evaluate':     'bntl3',

  'trig-identities.simplify':               '3wch5',
  'trig-identities.expand':                 'ygt6q',
  'trig-identities.fractions':              'ruobh',
  'trig-identities.given-form':             'm0h3o',

  'vectors.add-from-grid':                  'siypc',
  'vectors.draw-resultant':                 'xgfgq',
  'vectors.components':                     'e04j7',
  'vectors.missing':                        'lared',

  'straight-line.gradient-from-equation':   'ucs6m',
  'straight-line.intercept-from-equation':  'k2p9o',
  'straight-line.gradient-two-points':      '9858j',
  'straight-line.equation-two-points':      'jwfst',

  'sci-notation.convert':                   'l3u3i',
  'sci-notation.calculate':                 'y7fcp',
  'sci-notation.calculate-3sf':             'zm4v8',

  'pythagoras.find-side':                   '4ta70',

  'cosine-rule.side-exact':                 'a1enm',
  'cosine-rule.angle-exact':                'k9qm0',

  'sine-rule.side-exact':                   'sqers',

  'cosine-rule.side-degrees':               'apud8',

  'sine-rule.side-degrees':                 'dap5m',

  'triangle-area.sine':                     '666xs',

  'rounding.count-sig-figs':                '2dg74',
  'rounding.to-sig-figs':                   'daad4',
  'rounding.to-decimal-places':             '8hfy9',

  'sector.arc-forward':                     '67i3h',
  'sector.area-forward':                    'xl9p2',
  'sector.reverse':                         'yuj13',

  'volume.forward':                         '7iihk',
  'volume.reverse':                         '2x2on',
  'volume.sphere':                          'ipwge',
  'volume.sphere-scientific':               'fegn0',
  'volume.cone-approx-pi':                  'yh8il',
  'volume.pyramid-height':                  '8xgb7',
  'volume.sphere-cone-equal':               '6hap7',
  'volume.cone-minus-hemisphere':           's7970',
  'volume.cone-minus-cone':                 '0x5zj',
  'volume.sphere-shell':                    'vpapx',
  'volume.cylinder-plus-hemisphere':        'gqpln',
  'volume.box-plus-sphere':                 '540pf',
  'volume.pyramid-minus-pyramid':           'rfqs1',
  'volume.box-minus-hemisphere':            'hddcc',

  'linear-equations.basic':                 'eiunu',
  'linear-equations.brackets':              'wvurd',
  'linear-equations.fractions':             'b0sbz',
  'linear-equations.clear-denominators':    'wxaml',

  'form-equation.border':                   '7dzak',
  'form-equation.three-sided':              '8qa1e',
  'form-equation.triangle-rectangle':       'dqm1m',
  'form-equation.rectangle-square':         '374d9',
  'form-equation.rectangle-triangle':       '7otym',
  'form-equation.cuboid':                   'eqk5o',

  'vectors.magnitude':                      'i14ib',
  'vectors.magnitude-surd':                 '0k8yc',
  'vectors.components-midpoint':            'zlz3a',
  'vectors.pathway-parallelogram':          'obtqd',
  'vectors.pathway-extended':               'pnj6z',
  'vectors.pathway-multiples':              'fl1yr',
  'vectors.pathway-rhombus':                'vbnqi',
  'vectors.pathway-running-on':             'qjfc1',

  'coords.lettered-cuboid':                 '8bvtb',
  'coords.cube-on-cuboid':                  '9lve5',
  'coords.pyramid-on-cube':                 '6njip',
  'coords.prism':                           'g9avg',
  'coords.cone':                            '7idfw',

  'straight-line.gradient-and-x-intercept': '4pi7k',

  'trig.related-angle':                     'cvxl4',
  'trig.order-by-size':                     'hfzd9',

  'vectors.magnitude-difference':           'eodv5',

  'pythagoras.chord':                       'i0hsz',
  'pythagoras.converse':                    't8hly',
  'pythagoras.converse-joined':             's5i70',
  'pythagoras.converse-from-total':         'apxtq',
  'pythagoras.chord-reverse':               'v5p10',
  'pythagoras.chord-radius':                '1ma20',
  'pythagoras.space-diagonal':              'mjk95',
  'pythagoras.space-diagonal-fits':         'iup40',
  'pythagoras.coordinates-cuboid':          'o2d0r',
  'pythagoras.coordinates-pyramid':         'jz9xr',
  'pythagoras.two-circles-overlap':         'zb7a5',
  'pythagoras.two-circles-half-turn':       'p6k4d',
  'pythagoras.two-circles-snowman':         '1vx5j',

  'trig-diagram.cosine-side':               'vi5a0',
  'trig-diagram.cosine-angle':              'llj1e',
  'trig-diagram.sine-angle':                '43fww',
  'trig-diagram.area':                      'toch6',

  'bearings.two-bearings':                  'af93i',
  'bearings.three-sides-angle':             '9dj1r',
  'bearings.three-sides-bearing':           'lkqxy',
  'bearings.two-sides':                     '5n7sz',

  'composite.height-from-two-angles':       '1oyw2',
  'composite.perpendicular-in-triangle':    'e9af5',
  'composite.two-elevations':               'zjrff',
  'composite.split-side-cosine':            'iur8y',
  'composite.split-side-area':              'ey838',
  'composite.straight-line-angle':          'tyqsr',

  'trig-diagram.area-exact':                'hw6as',

  'composite.hexagon-area':                 'ds8xg',

  'sector.area-angle':                      'qan8k',
  'sector.area-angle-pi314':                'o51h8',
  'sector.arc-angle':                       'bi8yr',
  'sector.arc-angle-pi314':                 '0hhd3',
  'sector.area-arc':                        '73jev',
  'sector.angle-arc':                       'xdkqb',
  'sector.radius-arc':                      'zqqjg',
  'sector.segment-major':                   'rx79k',
  'sector.segment-minor':                   'gze44',
  'sector.triangle-minus-sector':           'vbrx3',
  'sector.similar-sectors':                 'emxri',
  'sector.polygon-segment':                 'jgj8r',

  'angles.polygon-produced':                '1dpfo',
  'angles.tangent-diameter':                'f2016',
  'angles.tangent-semicircle':              'hlgij',
  'angles.tangent-meets-diameter':          '0t4kd',
  'angles.two-tangents-chord':              'm2oct',
  'angles.two-tangents-diameters':          '1eohv',
  'angles.tangent-reflex':                  'lupwv',
  'angles.polygon-diameter':                'oiw47',
  'angles.bar-polygon':                     'i14wh',

  'similarity.volume-scale':                'plv69',
  'similarity.area-scale':                  'sbdha',
  'similarity.area-from-cost':              'c6dsa',
  'similarity.not-similar':                 'od1f9',
  'similarity.triangle-part':               'me3da',
  'similarity.triangle-rest':               'wqelx',
  'similarity.triangle-area':               '5w9q6',
};

/**
 * Ids whose code is deliberately not what `codeFor` derives, and why.
 *
 * The only good reason is a rename: the variation was renamed after links had
 * been shared, so it keeps the code its old name derived. Empty today, and an
 * entry here is a decision someone made rather than a threshold lowered.
 */
export const CODE_EXCEPTIONS: Record<string, string> = {};

/**
 * Code back to variation id, for resolving a shared link.
 *
 * Built here rather than by the caller so a duplicate is a startup failure in
 * every consumer at once, the way `types.ts` treats a duplicate topic name. A
 * duplicate would make one of the two variations unreachable by link, and
 * which one you got would depend on registry order.
 */
export const VARIATION_BY_CODE: Record<string, string> = {};
for (const [id, code] of Object.entries(VARIATION_CODES)) {
  const already = VARIATION_BY_CODE[code];
  if (already) {
    throw new Error(`Duplicate variation code "${code}" — ${already} and ${id}`);
  }
  VARIATION_BY_CODE[code] = id;
}
