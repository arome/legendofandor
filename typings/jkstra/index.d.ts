declare module 'jkstra' {
    namespace jKstra {
        const IN: boolean
        const OUT: boolean
        class Graph {
            vertices: Vertice[]
            addVertex(vertex: Vertex): void
            addEdge(vertice1: Vertice, vertice2: Vertice): void
        }
        namespace algos {
            export class Dijkstra {
                rebuildPath(end: any)
                shortestPath(source: Vertice, target: Vertice, opts?: any)
                traverse(source: Vertice, opts?: any)
                constructor(graph: Graph, opts?: any)
            }
        }
    }
    export interface Vertice {
        data: Vertex
    }
    export interface Vertex {
        id: any
        area: any
    }
    export default jKstra
}