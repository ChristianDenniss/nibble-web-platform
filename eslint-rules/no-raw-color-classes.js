// Enforces the color-token rule: every color must come from the globals.css token
// system. Scans every string literal / template-literal chunk (not just literal `className=`
// attributes) so it also catches clsx()/cn()-style conditional class construction, plus flags
// raw hex / two specifically-wrong var() names inside style objects.

const COLOR_FAMILIES = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'slate', 'gray', 'zinc', 'neutral', 'stone',
];
const PREFIXES = [
  'bg', 'text', 'border', 'from', 'to', 'via', 'ring', 'fill', 'stroke', 'divide',
  'outline', 'decoration', 'placeholder', 'caret', 'accent', 'shadow',
];

const PALETTE_CLASS_RE = new RegExp(
  `^(?:${PREFIXES.join('|')})-(?:${COLOR_FAMILIES.join('|')})-\\d{2,3}$`,
);
const WHITE_BLACK_CLASS_RE = new RegExp(`^(?:${PREFIXES.join('|')})-(?:white|black)$`);

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const WRONG_VAR_RE = /var\(\s*--(?:surface-base|text-primary)\s*\)/;

const COLOR_STYLE_KEYS = new Set([
  'color', 'background', 'backgroundColor', 'borderColor', 'fill', 'stroke', 'boxShadow', 'filter',
]);

function checkClassToken(token, node, context) {
  if (PALETTE_CLASS_RE.test(token) || WHITE_BLACK_CLASS_RE.test(token)) {
    context.report({
      node,
      message: `"${token}" is a raw Tailwind palette class - use a token class from globals.css instead.`,
    });
  }
}

function checkClassString(str, node, context) {
  if (typeof str !== 'string') return;
  for (const token of str.split(/\s+/)) checkClassToken(token, node, context);
}

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow raw Tailwind palette classes and raw hex colors - use globals.css tokens.' },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') checkClassString(node.value, node, context);
      },
      TemplateElement(node) {
        checkClassString(node.value.raw, node, context);
      },
      Property(node) {
        const keyName = node.key.type === 'Identifier' ? node.key.name
          : (node.key.type === 'Literal' ? String(node.key.value) : null);
        if (!keyName || !COLOR_STYLE_KEYS.has(keyName)) return;
        if (node.value.type !== 'Literal' || typeof node.value.value !== 'string') return;
        const value = node.value.value;
        if (HEX_RE.test(value)) {
          context.report({ node: node.value, message: `Raw hex color "${value}" - use a globals.css token (var(--color-*)) instead.` });
        } else if (WRONG_VAR_RE.test(value)) {
          context.report({ node: node.value, message: `"${value}" references a var name that doesn't exist - use var(--color-surface) or var(--color-content).` });
        }
      },
    };
  },
};
