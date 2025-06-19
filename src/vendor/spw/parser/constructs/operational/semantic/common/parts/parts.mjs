import { nominal }   from "../../../../nodal/nominal/generator.mjs";
import { numeric }   from "../../../../nodal/numeric/generator.mjs";
import { phrasal }   from "../../phrasal/generator.mjs";
import { container } from "../../../../nodal/container/generator.mjs";
export const commonPartOptions = [
    nominal,
    numeric,
    container,
    phrasal,
];
