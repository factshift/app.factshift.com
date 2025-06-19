import { nominal }     from "../../../../nodal/nominal/generator.mjs";
import { numeric }     from "../../../../nodal/numeric/generator.mjs";
import { phrasal }     from "../../phrasal/generator.mjs";
import { container }   from "../../../../nodal/container/generator.mjs";
import { operational } from "../../../pragmatic/generator.mjs";
import { common }      from "../../common/generator.mjs";
export const ordinalPartOptions = [
    nominal,
    numeric,
    container,
    phrasal,
    common,
    operational,
];
