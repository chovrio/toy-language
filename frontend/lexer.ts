// let x = 45 + (foo * bar);
//[ LetToken, IdentifierToken, EqualsToken, NumberToken, EOFToken]

export enum TokenType {
  // Literal Types
  Number,
  Identifier,
  // Keywords
  Let,
  Const,
  Fn, // fn

  // Grouping * Operators
  BinaryOperator,
  Equals,
  Comma,
  Dot,
  Colon,
  Semicolon,
  OpenParen, // (
  CloseParen, // )
  OpenBrace, // {
  CloseBrace, // }
  OpenBracket, // [
  CloseBracket, // ]
  EOF, // Signifies end of file
}
const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
  fn: TokenType.Fn,
};
export interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType): Token {
  return {
    value,
    type,
  };
}

function isalpha(src: string): boolean {
  /** nice idel */
  return src.toUpperCase() !== src.toLowerCase();
}

function isskippable(src: string): boolean {
  return src === " " || src === "\n" || src === "\t" || src === "\r";
}

function isint(str: string): boolean {
  const c = str.charCodeAt(0);
  const bcunds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return !!(c >= bcunds[0] && c <= bcunds[1]);
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  // Build each token until end of file
  while (src.length > 0) {
    if (src.length > 0) {
      if (src[0] === "(") {
        tokens.push(token(src.shift(), TokenType.OpenParen));
      } else if (src[0] === ")") {
        tokens.push(token(src.shift(), TokenType.CloseParen));
      } else if (src[0] === "{") {
        tokens.push(token(src.shift(), TokenType.OpenBrace));
      } else if (src[0] === "}") {
        tokens.push(token(src.shift(), TokenType.CloseBrace));
      } else if (src[0] === "[") {
        tokens.push(token(src.shift(), TokenType.OpenBracket));
      } else if (src[0] === "]") {
        tokens.push(token(src.shift(), TokenType.CloseBracket));
      } else if (
        src[0] === "+" ||
        src[0] === "-" ||
        src[0] === "*" ||
        src[0] === "/" ||
        src[0] === "%"
      ) {
        tokens.push(token(src.shift(), TokenType.BinaryOperator));
      } else if (src[0] === "=") {
        tokens.push(token(src.shift(), TokenType.Equals));
      } else if (src[0] === ";") {
        tokens.push(token(src.shift(), TokenType.Semicolon));
      } else if (src[0] === ":") {
        tokens.push(token(src.shift(), TokenType.Colon));
      } else if (src[0] === ",") {
        tokens.push(token(src.shift(), TokenType.Comma));
      } else if (src[0] === ".") {
        tokens.push(token(src.shift(), TokenType.Dot));
      } else {
        // Handle multicharacter tokens

        // Build number token
        if (isint(src[0])) {
          let num = "";
          while (src.length > 0 && isint(src[0])) {
            num += src.shift();
          }
          tokens.push(token(num, TokenType.Number));
        } else if (isalpha(src[0])) {
          let ident = ""; // foo let
          while (src.length > 0 && isalpha(src[0])) {
            ident += src.shift();
          }
          // check for reserved keywords
          const reserved = KEYWORDS[ident];
          if (typeof reserved === "number") {
            tokens.push(token(ident, reserved));
          } else {
            // Unreconized name must mean user defined symbol
            tokens.push(token(ident, TokenType.Identifier));
          }
        } else if (isskippable(src[0])) {
          src.shift();
        } else {
          console.log("Unreconized character found in source: ", src[0]);
          Deno.exit(1);
        }
      }
    }
  }
  tokens.push({ type: TokenType.EOF, value: "EndOffile" });
  return tokens;
}
