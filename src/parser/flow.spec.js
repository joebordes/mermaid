/**
* Created by knut on 14-11-03.
*/
describe('when parsing ',function(){
    beforeEach(function(){
        mermaid.graph.clear();
        parser.yy = mermaid.graph;
        /*parser.parse.parseError= function parseError(str, hash) {
            console.log(str);
        }*/
        console.log('in mm spec');
    });

    it('should handle a nodes and edges',function(){
        var res = parser.parse('graph TD;A-->B;');


        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['A'].id).toBe('A');
        expect(vert['B'].id).toBe('B');
        expect(edges.length).toBe(1);
        expect(edges[0].start).toBe('A');
        expect(edges[0].end).toBe('B');
        expect(edges[0].type).toBe('arrow');
        expect(edges[0].text).toBe('');
    });

    it('should handle open ended edges',function(){
        var res = parser.parse('graph TD;A---B;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();


        expect(edges[0].type).toBe('arrow_open');
    });

    it('should handle cross ended edges',function(){
        var res = parser.parse('graph TD;A--xB;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();


        expect(edges[0].type).toBe('arrow_cross');
    });

    it('should handle open ended edges',function(){
        var res = parser.parse('graph TD;A--oB;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();


        expect(edges[0].type).toBe('arrow_circle');
    });

    it('should handle text on edges without space',function(){
        var res = parser.parse('graph TD;A--x|textNoSpace|B;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();


        expect(edges[0].type).toBe('arrow_cross');
    });

    it('should handle text on edges with space',function(){
        var res = parser.parse('graph TD;A--x|text including space|B;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();


        expect(edges[0].type).toBe('arrow_cross');
    });

    it('should handle multi-line text',function(){
        var res = parser.parse('graph TD;A--o|text space|B;\n B-->|more text with space|C;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(edges[0].type).toBe('arrow_circle');
        expect(edges[1].type).toBe('arrow');
        expect(vert['A'].id).toBe('A');
        expect(vert['B'].id).toBe('B');
        expect(vert['C'].id).toBe('C');
        expect(edges.length).toBe(2);
        expect(edges[0].start).toBe('A');
        expect(edges[0].end).toBe('B');
        //expect(edges[0].text).toBe('text space');
        expect(edges[1].start).toBe('B');
        expect(edges[1].end).toBe('C');
        expect(edges[1].text).toBe('more text with space');
    });

    it('should handle text in vertices with space',function(){
        var res = parser.parse('graph TD;A[chimpansen hoppar]-->C;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['A'].type).toBe('square');
        expect(vert['A'].text).toBe('chimpansen hoppar');
    });

    it('should handle text in vertices with space',function(){
        var res = parser.parse('graph TD;A(chimpansen hoppar)-->C;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['A'].type).toBe('round');
        expect(vert['A'].text).toBe('chimpansen hoppar');
    });

    it('should handle text in vertices with space',function(){
        var res = parser.parse('graph TD;A{chimpansen hoppar}-->C;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['A'].type).toBe('diamond');
        expect(vert['A'].text).toBe('chimpansen hoppar');
    });
    it('should handle text in vertices with space',function(){
        var res = parser.parse('graph TD;A-->C{Chimpansen hoppar};');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['C'].type).toBe('diamond');
        expect(vert['C'].text).toBe('Chimpansen hoppar');
    });

    it('should handle text in vertices with åäö and minus',function(){
        var res = parser.parse('graph TD;A-->C{Chimpansen hoppar åäö-ÅÄÖ};');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['C'].type).toBe('diamond');
        expect(vert['C'].text).toBe('Chimpansen hoppar åäö-ÅÄÖ');
    });

    it('should handle a single node',function(){
        // Silly but syntactically correct
        var res = parser.parse('graph TD;A;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(edges.length).toBe(0);
        expect(vert['A'].styles.length).toBe(0);
    });
    it('should handle a single node with alphanumerics starting on a char',function(){
        // Silly but syntactically correct
        var res = parser.parse('graph TD;id1;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(edges.length).toBe(0);
        expect(vert['id1'].styles.length).toBe(0);
    });
    it('should handle a single node with alphanumerics starting on a num',function(){
        // Silly but syntactically correct
        var res = parser.parse('graph TD;1id;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(edges.length).toBe(0);
        expect(vert['1id'].styles.length).toBe(0);
    });
    //console.log(parser.parse('graph TD;style Q background:#fff;'));
    it('should handle styles for vertices',function(){
        var res = parser.parse('graph TD;style Q background:#fff;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        var style = vert['Q'].styles[0];

        expect(vert['Q'].styles.length).toBe(1);
        expect(vert['Q'].styles[0]).toBe('background:#fff');
    });

    //console.log(parser.parse('graph TD;style Q background:#fff;'));
    it('should handle styles for edges',function(){
        var res = parser.parse('graph TD;a-->b;\nstyle #0 stroke: #f66;');

        var edges = parser.yy.getEdges();

        expect(edges.length).toBe(1);
    });

    it('should handle multiple styles for a vortex',function(){
        var res = parser.parse('graph TD;style R background:#fff,border:1px solid red;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['R'].styles.length).toBe(2);
        expect(vert['R'].styles[0]).toBe('background:#fff');
        expect(vert['R'].styles[1]).toBe('border:1px solid red');
    });

    it('should handle multiple styles in a graph',function(){
        var res = parser.parse('graph TD;style S background:#aaa;\nstyle T background:#bbb,border:1px solid red;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['S'].styles.length).toBe(1);
        expect(vert['T'].styles.length).toBe(2);
        expect(vert['S'].styles[0]).toBe('background:#aaa');
        expect(vert['T'].styles[0]).toBe('background:#bbb');
        expect(vert['T'].styles[1]).toBe('border:1px solid red');
    });

    it('should handle styles and graph definitons in a graph',function(){
        var res = parser.parse('graph TD;S-->T;\nstyle S background:#aaa;\nstyle T background:#bbb,border:1px solid red;');

        var vert = parser.yy.getVertices();
        var edges = parser.yy.getEdges();

        expect(vert['S'].styles.length).toBe(1);
        expect(vert['T'].styles.length).toBe(2);
        expect(vert['S'].styles[0]).toBe('background:#aaa');
        expect(vert['T'].styles[0]).toBe('background:#bbb');
        expect(vert['T'].styles[1]).toBe('border:1px solid red');
    });
    it('should handle styles and graph definitons in a graph',function(){
        var res = parser.parse('graph TD;style T background:#bbb,border:1px solid red;');
        //var res = parser.parse('graph TD;style T background: #bbb;');

        var vert = parser.yy.getVertices();

        expect(vert['T'].styles.length).toBe(2);
        expect(vert['T'].styles[0]).toBe('background:#bbb');
        expect(vert['T'].styles[1]).toBe('border:1px solid red');
    });
});