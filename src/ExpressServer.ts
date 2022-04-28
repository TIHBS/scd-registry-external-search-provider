import express from "express";
import { Express } from "express-serve-static-core/index";
import { capitalizeFirstLetter } from "./util/Util.js";
import package_json from "../package.json";
import { QueryService } from "./QueryService.js";
import cors from "cors";
import bodyParser from "body-parser";

export class ExpressServer {
  private app: Express;
  private port: number;
  private queryService: QueryService;

  constructor(queryService: QueryService, port: number = 3000) {
    this.app = express()
      .use(
        cors({
          origin: "*",
        })
      )
      .use(bodyParser.urlencoded({ extended: false }))
      .use(bodyParser.json());

    this.port = port;
    this.queryService = queryService;
  }

  public registerRoutes() {
    this.app
      .get("/", async (req, res) => {
        const queryStr = req.query.query;
        if (!queryStr) {
          res.status(422).send("You have to specify something to search for!");
          return;
        }

        console.log(`Request with the following query ${queryStr}`);
        const result = await this.queryService.query(queryStr as string);

        if (req.query.onlyId && req.query.onlyId == "true") {
          const onlyId = result.map((scdWithId) => scdWithId.id);
          res.send(onlyId);
        } else {
          res.send(result);
        }
      })
      .use((_req, res) =>
        res.status(404).json({ success: false, error: "Route not found" })
      );
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(
        `${capitalizeFirstLetter(package_json.name)} listening at ${this.port}`
      );
    });
  }
}
