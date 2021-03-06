import express from "express";
import { Express } from "express-serve-static-core/index";
import { capitalizeFirstLetter } from "../external/scd-registry-common/src/util/String";
import package_json from "../package.json";
import { QueryService } from "./QueryService";
import cors from "cors";
import bodyParser from "body-parser";

export class ExpressServer {
  public app: Express;
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
        const onlyIds =
          req.query.onlyId != undefined && req.query.onlyId == "true";
        const result = await this.queryService.query(
          queryStr as string,
          onlyIds
        );
        res.send(result);
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
