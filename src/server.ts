import Debug from "debug";
import initalizeApp from "./app";
const debug = Debug("app");

const startServer = async () => {
  const app = await initalizeApp();

  app.listen(parseInt(process.env.PORT, 10), () => {
    debug(
      `Server running at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`
    );
  });
};

startServer();
