import express from "express";
import { Express } from "express-serve-static-core/index";
import { capitalizeFirstLetter } from "./util/Util.js";
import package_json from "../package.json";

export class ExpressServer {
  private app: Express;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
  }

  public registerRoutes() {
    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(
        `${capitalizeFirstLetter(package_json.name)} listening at ${this.port}`
      );
    });
  }
}
