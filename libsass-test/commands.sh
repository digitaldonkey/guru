#!/bin/bash


# Usage: sassc [options] [INPUT] [OUTPUT]
# 
# Options:
#    -s, --stdin             Read input from standard input instead of an input file.
#    -t, --style NAME        Output style. Can be: nested, expanded, compact, compressed.
#    -l, --line-numbers      Emit comments showing original line numbers.
#        --line-comments
#    -I, --load-path PATH    Set Sass import path.
#    -m, --sourcemap         Emit source map.
#    -M, --omit-map-comment  Omits the source map url comment.
#    -p, --precision         Set the precision for numbers.
#    -v, --version           Display compiled versions.
#    -h, --help              Display this help message.
#    

# dev
sassc -m -l -t nested ./test.scss ./test.css

# live 
sassc -t compressed ./test.scss ./test.min.css


# Output
echo '### test.css ###'
echo ""
cat ./test.css

echo ""
echo ""

echo "### test.min.css ###"
echo ""
cat ./test.min.css