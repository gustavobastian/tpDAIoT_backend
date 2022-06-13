const config = require("./../config")
const glob = require("glob");
const registerRoutes = (router) => {
    const isWin = process.platform === "win32";
    const path = config.ENVIRONMENT === "dev" ? __dirname : config.ROUTER_PATH;
    const routes = glob.sync((isWin ? path.replace(/\\/g, '/') : path) + '/**/*.router');
    routes.map(route => register(route, router));
}

const register = (routePath, router) => {
    const route = require(routePath);
    const routeName = routePath.split("/").pop().split(".")[0];
    console.log("Rutas registradas: ", routeName);
    router.use(`/${routeName}`, route.register(router));
}

module.exports = registerRoutes;
