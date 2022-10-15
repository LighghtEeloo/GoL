export type BlockT = {
    id: number;
    y: number;
    x: number;
    color: number;
}

export type MapT = BlockT[][];

export const Block = {
    init({ w, h }: { w: number, h: number }): MapT {
        let map = [];
        for (let y = 0; y < h; y++) {
            map[y] = [];
            for (let x = 0; x < w; x++) {
                map[y][x] = {
                    id: y * h + x,
                    y: y,
                    x: x,
                    color: 0
                };
            }
        }

        // self-defined
        let move = (last, dy, dx) => {
            let next = last.map(([y, x]) => {
                return [y + dy, x + dx];
            });
            return next;
        };
        let recipe = [
            // Block
            [2, 2],
            [2, 3],
            [3, 2],
            [3, 3],

            // Blinker
            [3, 27],
            [3, 28],
            [3, 29],

            // Toad
            ...move([
                [3, 58],
                [3, 59],
                [3, 60],
                [4, 57],
                [4, 58],
                [4, 59],
            ], 0, -2),

            // Beacon
            ...move([
                [8, 28],
                [8, 29],
                [9, 28],
                [9, 29],
                [10, 30],
                [10, 31],
                [11, 30],
                [11, 31],
            ], -6, 52),

            // Pulsar
            ...move([
                [13, 24],
                [13, 25],
                [13, 26],
                [13, 30],
                [13, 31],
                [13, 32],
                [14, 24],
                [14, 28],
                [14, 32],
                [15, 24],
                [15, 28],
                [15, 32],
                [16, 24],
                [16, 28],
                [16, 32],
                [17, 24],
                [17, 25],
                [17, 26],
                [17, 30],
                [17, 31],
                [17, 32],
                [18, 25],
                [18, 26],
                [18, 30],
                [18, 31],
            ], -10, 80),

            // Pentadecathlon
            ...move([
                [20, 28],
                [20, 29],
                [20, 30],
                [21, 27],
                [21, 31],
                [22, 27],
                [22, 31],
                [23, 27],
                [23, 31],
                [24, 28],
                [24, 29],
                [24, 30],
            ], 2, 79),


            // Glider
            ...move([
                [10, 9],
                [10, 10],
                [10, 11],
                [9, 11],
                [8, 10],
            ], 20, 74),


            ...move([
                // LWSS
                [30, 26],
                [30, 27],
                [30, 31],
                [31, 26],
                [31, 30],
                [32, 26],
                [32, 27],
                [32, 28],
                [32, 29],

                // MWSS
                [34, 24],
                [34, 25],
                [34, 29],
                [35, 24],
                [35, 28],
                [36, 24],
                [36, 25],
                [36, 26],
                [36, 27],

                // HWSS
                [38, 22],
                [38, 23],
                [38, 27],
                [39, 22],
                [39, 26],
                [40, 22],
                [40, 23],
                [40, 24],
                [40, 25],
            ], -10, -7),

            // Pulsar 3
            ...move([
                [1, 2],
                [1, 3],
                [1, 4],
                [6, 2],
                [6, 3],
                [6, 4],
                [2, 1],
                [3, 1],
                [4, 1],
                [2, 6],
                [3, 6],
                [4, 6],

                [-1, 2],
                [-1, 3],
                [-1, 4],
                [-6, 2],
                [-6, 3],
                [-6, 4],
                [-2, 1],
                [-3, 1],
                [-4, 1],
                [-2, 6],
                [-3, 6],
                [-4, 6],

                [-1, -2],
                [-1, -3],
                [-1, -4],
                [-6, -2],
                [-6, -3],
                [-6, -4],
                [-2, -1],
                [-3, -1],
                [-4, -1],
                [-2, -6],
                [-3, -6],
                [-4, -6],

                [1, -2],
                [1, -3],
                [1, -4],
                [6, -2],
                [6, -3],
                [6, -4],
                [2, -1],
                [3, -1],
                [4, -1],
                [2, -6],
                [3, -6],
                [4, -6],
            ], 30, 60),
        ]

        for (const [y, x] of recipe) {
            map[y][x].color = 1;
        }
        return map;
    },
    iter({ w, h }: { w: number, h: number }, last: MapT): MapT {
        let map = [];
        for (let y = 0; y < h; y++) {
            map[y] = [];
            for (let x = 0; x < w; x++) {
                map[y][x] = this.query({ x, y }, { w, h }, last);
            }
        }
        return map;
    },
    query({ x, y }: { x: number, y: number }, { w, h }: { w: number, h: number }, map: MapT): BlockT {
        let cnt = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) {
                    continue;
                }
                let nx = x + i;
                let ny = y + j;
                if (nx < 0 || nx >= w || ny < 0 || ny >= h) {
                    continue;
                }
                if (map[ny][nx].color == 1) {
                    cnt++;
                }
            }
        }

        let last = map[y][x];
        if (last.color == 1) {
            if (cnt == 2 || cnt == 3) {
                return last;
            }
            return {
                id: last.id,
                y: last.y,
                x: last.x,
                color: 0
            };
        } else {
            if (cnt == 3) {
                return {
                    id: last.id,
                    y: last.y,
                    x: last.x,
                    color: 1
                };
            }
            return last;
        }
        // last.color = (cnt == 3 || (cnt == 2 && last.color == 1)) ? 1 : 0;
        return last;
    }
}