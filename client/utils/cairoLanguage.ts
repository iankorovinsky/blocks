export function registerCairoLanguageSupport(_monaco: any) {
  if (!_monaco.languages) return;
  
  const languageId = 'cairo'
  _monaco.languages.register({ id: languageId })
  _monaco.languages.setLanguageConfiguration(languageId, {
    comments: {
      lineComment: '#',
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
      ['%{', '%}'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '%{', close: '%}' },
      { open: "'", close: "'", notIn: ['string', 'comment'] },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '%{', close: '%}' },
      { open: "'", close: "'" },
    ],
  })
  _monaco.languages.setMonarchTokensProvider(languageId, {
    defaultToken: '',
    tokenPostfix: '.cairo',

    brackets: [
      { token: 'delimiter.curly', open: '{', close: '}' },
      { token: 'delimiter.parenthesis', open: '(', close: ')' },
      { token: 'delimiter.square', open: '[', close: ']' },
      { token: 'delimiter.curly', open: '%{', close: '%}' },
      { token: 'delimiter.angle', open: '<', close: '>' },
    ],

    keywords: [
      'if', 'else', 'end',
      'alloc_locals', 'as', 'assert', 'cast', 'const', 'dw', 'felt',
      'from', 'func', 'import', 'let', 'local', 'member', 'nondet',
      'return', 'static_assert', 'struct', 'tempvar', 'with_attr',
      'with', 'ap', 'fp', 'call', 'jmp', 'ret', 'abs', 'rel', 'fn', 'mod', 'impl', 'trait',
      'use', 'ref', 'super', 'self'

    ],

    typeKeywords: [
      'u8', 'u16', 'u32', 'u64', 'u128', 'u256',
      'i8', 'i16', 'i32', 'i64', 'i128', 'i256',
      'usize', 'bool', 'felt252', 'bytes31', 'ByteArray',
      'felt', 'ContractAddress', 'ClassHash',
      'StorageAddress', 'StorageBaseAddress', 'ContractState', 'TContractState',
    ],

    operators: ['=', ':', '==', '++', '+', '-', '*', '**', '/', '&', '%', '_'],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    numberDecimal: /[+-]?[0-9]+/,
    numberHex: /[+-]?0x[0-9a-fA-F]+/,

    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@typeKeywords': 'type',
            '@default': 'identifier',
          },
        }],
        { include: '@whitespace' },
        [/^%[a-zA-Z]\w*/, 'tag'],
        [/[{}()\[\]<>]/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'delimiter',
            '@default': '',
          },
        }],
        [/(@numberHex)/, 'number.hex'],
        [/(@numberDecimal)/, 'number'],
        [/'[^']*'/, 'string'],
      ],

      whitespace: [
        [/\s+/, 'white'],
        [/(^#.*$)/, 'comment'],
      ],
    },
  })

  _monaco.editor.defineTheme('cairo-theme', {
    base: 'vs',
    inherit: false,
    rules: [
      { token: '', foreground: '#000000' },
      { token: 'identifier', foreground: '#000000' },
      { token: 'identifier.cairo', foreground: '#000000' },
      { token: 'keyword', foreground: '#0000FF' },
      { token: 'keyword.cairo', foreground: '#0000FF' },
      { token: 'type', foreground: '#FF8C00' },          // orange for types
      { token: 'type.cairo', foreground: '#FF8C00' },    // orange for types
      { token: 'string.cairo', foreground: '#008000' },
      { token: 'number.cairo', foreground: '#098658' },
      { token: 'delimiter.cairo', foreground: '#000000' },
      { token: 'tag.cairo', foreground: '#800000' },
      { token: 'comment.cairo', foreground: '#008000' },
      { token: 'white.cairo', foreground: '#000000' },
      { token: 'delimiter', foreground: '#000000' },
    ],
    colors: {
      'editor.foreground': '#000000'
    }
  });

  _monaco.editor.setTheme('cairo-theme');
} 