var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_express = __toESM(require("express"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_hdb = __toESM(require("hdb"), 1);
var import_cors = __toESM(require("cors"), 1);
import_dotenv.default.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var app = (0, import_express.default)();
var PORT = process.env.PORT ? parseInt(process.env.PORT) : 7850;
app.use((0, import_cors.default)());
app.use(import_express.default.json());
var transactionLogs = [];
function addLog(type, message, payload) {
  const entry = {
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
    type,
    message,
    payload
  };
  transactionLogs.unshift(entry);
  if (transactionLogs.length > 100) transactionLogs.pop();
  console.log(`[${entry.type}] ${entry.message}`);
}
addLog("INFO", "Iniciando sistema TandemPRO...");
var sapConfig = {
  serviceLayerUrl: process.env.SAP_SERVICE_LAYER_URL || "https://172.19.0.88:50000/b1s/v1",
  hanaServer: process.env.HANA_SERVER || "172.19.0.88:30015",
  hanaUser: process.env.HANA_USER || "SYSTEM",
  hanaPassword: process.env.HANA_PASSWORD || "Admin123",
  isSandbox: process.env.IS_SANDBOX === "true"
  // Default to FALSE to attempt real HANA connection first
};
var simulatedSchemas = [
  { DbName: "SBO_TANDEMPRO_PROD", cpnyName: "TandemPRO S.A. - Producci\xF3n" },
  { DbName: "SBO_TANDEMPRO_TEST", cpnyName: "TandemPRO S.A. - Pruebas" },
  { DbName: "FG_TANDEM_GRUPO", cpnyName: "Grupo Industrial FG - Producci\xF3n" },
  { DbName: "SBO_SANDBOX_DEMO", cpnyName: "SBO Common Sandbox" }
];
var simulatedProductionOrders = [
  {
    DocEntry: 101,
    DocNum: 10024,
    ItemCode: "PROD-501",
    ItemName: "Cable de Cobre Ultra-HD 8mm",
    Status: "Released",
    // Released = Liberada
    PlannedQty: 5e3,
    CompletedQty: 0,
    Warehouse: "ALM-PROD",
    U_Machine: "EXT-03",
    U_Operator: "Juan P\xE9rez",
    PostDate: "2026-07-01",
    DueDate: "2026-07-10",
    Formula: "FORM-COBRE-8MM",
    Proceso: "1",
    // 1 -> "En Linea"
    FechaIni: "2026-07-01",
    U_HORAINI: "0800",
    FechaFin: "2026-07-02",
    U_HORAFIN: "1630",
    TipoProducto: "L",
    // L -> "Linea"
    Presentacion: "P",
    // P -> "Peletizado"
    TamMatriz: "4,5",
    // 4,5 -> "4,5"
    MallaMolino: "3",
    // 3 -> "3"
    LineProduccion: "3",
    // 3 -> "Linea 3"
    CantPLC: 5015,
    Etiqueta: "NARANJA",
    // NARANJA -> "Naranja"
    Programacion: "PLANIFICADO",
    // PLANIFICADO -> "Planificado"
    Negocio: "GRA",
    // GRA -> "Granusa"
    U_PRIORIDAD: "N",
    Components: [
      { ItemCode: "MAT-01", ItemName: "Cobre Electrol\xEDtico 8mm (kg)", PlannedQty: 5050, IssuedQty: 0, Warehouse: "ALM-MP" },
      { ItemCode: "MAT-02", ItemName: "Pol\xEDmero PVC Aislante (kg)", PlannedQty: 1200, IssuedQty: 0, Warehouse: "ALM-MP" },
      { ItemCode: "MAT-03", ItemName: "Bobina de Madera Grande (u)", PlannedQty: 10, IssuedQty: 0, Warehouse: "ALM-MP" }
    ],
    ThirdPartyTelemetry: {
      wsStatus: "Ready",
      finishedQtyRecorded: 4980,
      machineId: "EXT-03",
      runHours: 8.2,
      actualConsumption: [
        { ItemCode: "MAT-01", Qty: 5180, notes: "Falla de arranque en extrusora caus\xF3 desecho de cobre" },
        { ItemCode: "MAT-02", Qty: 1220, notes: "Consumo normal" },
        { ItemCode: "MAT-03", Qty: 11, notes: "Se da\xF1\xF3 1 bobina durante el bobinado; total 11 usadas" }
      ],
      discrepancyAnalyzed: false
    }
  },
  {
    DocEntry: 102,
    DocNum: 10025,
    ItemCode: "PROD-202",
    ItemName: 'Tuber\xEDa Industrial PVC 3"',
    Status: "Released",
    PlannedQty: 2500,
    CompletedQty: 0,
    Warehouse: "ALM-PROD",
    U_Machine: "EXT-01",
    U_Operator: "Ana G\xF3mez",
    PostDate: "2026-07-03",
    DueDate: "2026-07-12",
    Formula: "FORM-PVC-3PULG",
    Proceso: "2",
    // 2 -> "Concluido"
    FechaIni: "2026-07-03",
    U_HORAINI: "0900",
    FechaFin: "2026-07-04",
    U_HORAFIN: "1745",
    TipoProducto: "E",
    // E -> "Especifico"
    Presentacion: "H",
    // H -> "Harinado"
    TamMatriz: "6",
    // 6 -> "6"
    MallaMolino: "4,5",
    // 4,5 -> "4,5"
    LineProduccion: "1",
    // 1 -> "Linea 1"
    CantPLC: 2510,
    Etiqueta: "AZUL",
    // AZUL -> "Azul"
    Programacion: "ADELANTADO",
    // ADELANTADO -> "Adelantado"
    Negocio: "PRY",
    // PRY -> "Pryme"
    U_PRIORIDAD: "A",
    Components: [
      { ItemCode: "MAT-02", ItemName: "Pol\xEDmero PVC Aislante (kg)", PlannedQty: 3e3, IssuedQty: 0, Warehouse: "ALM-MP" },
      { ItemCode: "MAT-04", ItemName: "Estabilizador de Plomo (kg)", PlannedQty: 150, IssuedQty: 0, Warehouse: "ALM-MP" }
    ],
    ThirdPartyTelemetry: {
      wsStatus: "Ready",
      finishedQtyRecorded: 2520,
      machineId: "EXT-01",
      runHours: 4.5,
      actualConsumption: [
        { ItemCode: "MAT-02", Qty: 2990, notes: "Excelente rendimiento t\xE9rmico" },
        { ItemCode: "MAT-04", Qty: 148, notes: "Consumo nominal" }
      ],
      discrepancyAnalyzed: false
    }
  },
  {
    DocEntry: 103,
    DocNum: 10026,
    ItemCode: "PROD-109",
    ItemName: "Planchas de Acero Inoxidable 2x1m",
    Status: "Planned",
    // Planned = Planificada
    PlannedQty: 150,
    CompletedQty: 0,
    Warehouse: "ALM-PROD",
    U_Machine: "PRE-02",
    U_Operator: "Carlos Ruiz",
    PostDate: "2026-07-05",
    DueDate: "2026-07-15",
    Formula: "FORM-ACERO-2X1",
    Proceso: "1",
    // 1 -> "En Linea"
    FechaIni: "2026-07-05",
    U_HORAINI: "0730",
    FechaFin: "2026-07-06",
    U_HORAFIN: "1530",
    TipoProducto: "R",
    // R -> "Reproceso"
    Presentacion: "P",
    // P -> "Peletizado"
    TamMatriz: "0",
    // 0 -> "Ninguno"
    MallaMolino: "-",
    // - -> "-"
    LineProduccion: "2",
    // 2 -> "Linea 2"
    CantPLC: 150,
    Etiqueta: "VERDE",
    // VERDE -> "Verde"
    Programacion: "NOPLANIFICADO",
    // NOPLANIFICADO -> "NOPLANIFICADO"
    Negocio: "FDL",
    // FDL -> "Feed Lot"
    U_PRIORIDAD: "N",
    Components: [
      { ItemCode: "MAT-09", ItemName: "Bobina de Acero Inoxidable (ton)", PlannedQty: 12, IssuedQty: 0, Warehouse: "ALM-MP" }
    ],
    ThirdPartyTelemetry: null
  }
];
var getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
app.get("/api/logs", (req, res) => {
  res.json(transactionLogs);
});
app.post("/api/logs/clear", (req, res) => {
  transactionLogs.length = 0;
  addLog("INFO", "Consola de transacciones limpiada.");
  res.json({ success: true });
});
app.get("/api/config", (req, res) => {
  res.json(sapConfig);
});
app.post("/api/config", (req, res) => {
  sapConfig = { ...sapConfig, ...req.body };
  addLog("INFO", `Configuraci\xF3n de SAP B1 actualizada. Modo: ${sapConfig.isSandbox ? "Simulador/Sandbox" : "SAP Real Service Layer"}`);
  res.json({ success: true, config: sapConfig });
});
app.get("/api/sap/schemas", async (req, res) => {
  addLog("INFO", "Cargando esquemas de bases de datos SAP B1...");
  if (sapConfig.isSandbox) {
    addLog("SL_RESPONSE", "Esquemas cargados exitosamente (Modo Simulador)", simulatedSchemas);
    return res.json(simulatedSchemas);
  }
  const [host, portStr] = sapConfig.hanaServer.split(":");
  const port = parseInt(portStr || "30015");
  addLog("SL_REQUEST", `Iniciando conexi\xF3n HANA a SBOCOMMON en ${host}:${port} como usuario ${sapConfig.hanaUser}...`);
  const client = import_hdb.default.createClient({
    host,
    port,
    user: sapConfig.hanaUser,
    password: sapConfig.hanaPassword
  });
  let connectionResponded = false;
  const timeoutId = setTimeout(() => {
    if (!connectionResponded) {
      connectionResponded = true;
      try {
        client.end();
      } catch (e) {
      }
      addLog("WARN", `Conexi\xF3n a HANA (${host}:${port}) excedi\xF3 l\xEDmite de tiempo (5s). El servidor no est\xE1 accesible desde este contenedor de desarrollo. Cargando esquemas simulados para demostraci\xF3n.`);
      const simulatedWithLabel = simulatedSchemas.map((s) => ({
        ...s,
        cpnyName: `${s.cpnyName} (Simulado: ${host} offline)`
      }));
      res.json(simulatedWithLabel);
    }
  }, 5e3);
  client.connect((err) => {
    if (connectionResponded) return;
    if (err) {
      connectionResponded = true;
      clearTimeout(timeoutId);
      addLog("WARN", `No se pudo conectar a HANA en ${host}:${port}: ${err.message}. Cargando esquemas simulados como fallback.`);
      const simulatedWithLabel = simulatedSchemas.map((s) => ({
        ...s,
        cpnyName: `${s.cpnyName} (Simulado: error de conexi\xF3n)`
      }));
      return res.json(simulatedWithLabel);
    }
    const query = 'select "dbName" as "DbName", "cmpName" as "cpnyName" from "SBOCOMMON"."SRGC" order by 1';
    addLog("SL_REQUEST", `Ejecutando SQL: ${query}`);
    client.exec(query, (execErr, rows) => {
      if (connectionResponded) return;
      connectionResponded = true;
      clearTimeout(timeoutId);
      client.end();
      if (execErr) {
        addLog("ERROR", `Error de ejecuci\xF3n en HANA: ${execErr.message}`);
        return res.json(simulatedSchemas);
      }
      addLog("INFO", `Filas crudas devueltas por HANA en consulta: ${JSON.stringify(rows)}`);
      const formattedSchemas = (rows || []).map((row) => {
        const DbName = row.DbName || row.DBNAME || row.dbName || row.dbname || row.Dbname || "";
        const cpnyName = row.cpnyName || row.CPNYNAME || row.cmpName || row.CMPNAME || row.cmpname || row.cpnyname || "";
        return { DbName, cpnyName };
      }).filter((s) => s.DbName !== "");
      addLog("SL_RESPONSE", `Conexi\xF3n exitosa. Se cargaron ${formattedSchemas.length} esquemas reales desde SBOCOMMON.`, formattedSchemas);
      res.json(formattedSchemas);
    });
  });
});
app.post("/api/sap/login", async (req, res) => {
  const { username, password, schema, serviceLayerUrl, isSandbox } = req.body;
  addLog("INFO", `Intento de login. Usuario: ${username}, Esquema: ${schema}, Modo: ${isSandbox ? "Sandbox" : "Service Layer"}`);
  if (!username || !password) {
    addLog("WARN", "Intento de login fallido: Credenciales vac\xEDas");
    return res.status(400).json({ success: false, error: "El usuario y la contrase\xF1a son obligatorios." });
  }
  if (isSandbox) {
    if (password === "error") {
      addLog("ERROR", `Login fallido para usuario: ${username}. Password incorrecto en Sandbox.`);
      return res.status(401).json({ success: false, error: "Credenciales de SAP incorrectas (Simulado: use cualquier clave excepto 'error')." });
    }
    const mockSessionId = `sandbox-sess-${Math.random().toString(36).substring(2, 15)}`;
    addLog("SL_REQUEST", "POST /b1s/v1/Login", { CompanyDB: schema, UserName: username });
    addLog("SL_RESPONSE", "200 OK (SessionId Generado)", { SessionId: mockSessionId, Version: "10.00.140" });
    const activeUser = {
      SessionID: mockSessionId,
      user_code: username,
      username: username === "manager" ? "Manager de Producci\xF3n" : `Usuario: ${username.toUpperCase()}`,
      u_email: `${username}@tandempro.com.py`,
      CompnyName: simulatedSchemas.find((s) => s.DbName === schema)?.cpnyName || "TandemPRO S.A.",
      CompnyAddr: "Av. Las Industrias 1024, Complejo Industrial Tandem",
      phone1: "+595 21 555-1234",
      e_mail: "contacto@tandempro.com.py",
      BD: schema,
      Sucursal: "Planta Principal Capiat\xE1",
      Departamento: "Operaciones de Producci\xF3n",
      SucursalCode: "PL-01",
      SucursalName: "Planta Industrial de Extrusi\xF3n",
      origen: schema.startsWith("FG_") ? 1 : 2,
      PDF: "/reports/pdf_gen",
      XML: "/reports/xml_gen",
      IMG: "/reports/img_gen",
      isSandbox: true
    };
    addLog("SUCCESS", `Conexi\xF3n SAP SL exitosa. Bienvenido ${activeUser.username}!`);
    return res.json({ success: true, user: activeUser });
  }
  const urlToUse = serviceLayerUrl || sapConfig.serviceLayerUrl;
  const loginUrl = `${urlToUse.replace(/\/$/, "")}/Login`;
  try {
    addLog("SL_REQUEST", `POST ${loginUrl}`, { CompanyDB: schema, UserName: username });
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;odata=minimalmetadata"
      },
      body: JSON.stringify({
        CompanyDB: schema,
        UserName: username,
        Password: password
      })
    });
    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      addLog("ERROR", `La respuesta del Service Layer no es JSON v\xE1lido: ${text.substring(0, 200)}`);
    }
    if (response.ok && data.SessionId) {
      addLog("SL_RESPONSE", `200 OK - Login Exitoso`, { SessionId: data.SessionId });
      const [host, portStr] = sapConfig.hanaServer.split(":");
      const port = parseInt(portStr || "30015");
      const client = import_hdb.default.createClient({
        host,
        port,
        user: sapConfig.hanaUser,
        password: sapConfig.hanaPassword
      });
      addLog("INFO", `Iniciando conexi\xF3n HANA para extraer metadata de usuario y empresa en ${host}:${port}...`);
      let connectionResponded = false;
      const sendResponse = (companyData, userData) => {
        if (connectionResponded) return;
        connectionResponded = true;
        const activeUser = {
          SessionID: data.SessionId,
          user_code: username,
          username: userData?.username || (username.toUpperCase() === "MANAGER" ? "Manager SAP" : `Usuario: ${username}`),
          u_email: userData?.u_email || `${username}@empresa.com`,
          CompnyName: companyData?.CompnyName || schema,
          CompnyAddr: companyData?.CompnyAddr || "Direcci\xF3n Registrada en OADM",
          phone1: companyData?.phone1 || "Tel\xE9fono OADM",
          e_mail: companyData?.e_mail || "email@empresa.com",
          BD: schema,
          Sucursal: userData?.Sucursal || "Sucursal Central",
          Departamento: userData?.Departamento || "Producci\xF3n",
          SucursalCode: userData?.SucursalCode || "1",
          SucursalName: userData?.SucursalName || "Principal",
          origen: schema.includes("FG_") ? 1 : 2,
          PDF: "PDF_SAP_STORE",
          XML: "XML_SAP_STORE",
          IMG: "IMG_SAP_STORE",
          isSandbox: false
        };
        addLog("SUCCESS", `\xA1Conexi\xF3n real establecida con SAP Service Layer y HANA! ID de Sesi\xF3n: ${data.SessionId}`);
        res.json({ success: true, user: activeUser });
      };
      const timeoutId = setTimeout(() => {
        if (!connectionResponded) {
          addLog("WARN", "La consulta HANA para metadata excedi\xF3 el tiempo l\xEDmite (5s). Usando valores por defecto para el usuario.");
          try {
            client.end();
          } catch (e) {
          }
          sendResponse();
        }
      }, 5e3);
      client.connect((err) => {
        if (connectionResponded) return;
        if (err) {
          clearTimeout(timeoutId);
          addLog("WARN", `Error de conexi\xF3n a HANA para metadata: ${err.message}. Cargando valores por defecto.`);
          return sendResponse();
        }
        const q1 = `SELECT A."CompnyName", A."CompnyAddr", A."Phone1", A."E_Mail" FROM "${schema}"."OADM" A`;
        addLog("SL_REQUEST", `Ejecutando SQL en HANA: ${q1}`);
        client.exec(q1, (err1, rows1) => {
          if (connectionResponded) return;
          let companyData = null;
          if (!err1 && rows1 && rows1.length > 0) {
            const r1 = rows1[0];
            companyData = {
              CompnyName: r1.CompnyName || r1.COMPNYNAME || r1.compnyname || r1.cmpName || schema,
              CompnyAddr: r1.CompnyAddr || r1.COMPNYADDR || r1.compnyaddr || r1.cmpAddr || "Direcci\xF3n Registrada en OADM",
              phone1: r1.Phone1 || r1.PHONE1 || r1.phone1 || "Tel\xE9fono OADM",
              e_mail: r1.E_Mail || r1.E_MAIL || r1.e_mail || "email@empresa.com"
            };
            addLog("SL_RESPONSE", `Datos de OADM cargados`, companyData);
          } else if (err1) {
            addLog("WARN", `Error de consulta en OADM: ${err1.message}`);
          }
          const q2 = `
            SELECT T0."USERID", T0."U_NAME", ifnull(T0."E_Mail", '') as "E_Mail", 
                   T1."Name" as "Sucursal", T2."Name" as "Departamento", T1."Code" as "SucursalCode", T1."Remarks" as "SucursalName"
            FROM "${schema}"."OUSR" T0
            LEFT OUTER JOIN "${schema}"."OUBR" T1 ON T0."Branch" = T1."Code"
            LEFT OUTER JOIN "${schema}"."OUDP" T2 ON T0."Department" = T2."Code"
            WHERE T0."USER_CODE" = '${username}'
          `;
          addLog("SL_REQUEST", `Ejecutando SQL en HANA: ${q2}`);
          client.exec(q2, (err2, rows2) => {
            if (connectionResponded) return;
            clearTimeout(timeoutId);
            client.end();
            let userData = null;
            if (!err2 && rows2 && rows2.length > 0) {
              const r2 = rows2[0];
              userData = {
                userid: r2.USERID || r2.userid || r2.UserId || "",
                username: r2.U_NAME || r2.u_name || r2.username || username,
                u_email: r2.E_Mail || r2.e_mail || r2.u_email || `${username}@empresa.com`,
                Sucursal: r2.Sucursal || r2.sucursal || "Sucursal Central",
                Departamento: r2.Departamento || r2.departamento || "Producci\xF3n",
                SucursalCode: r2.SucursalCode || r2.sucursalcode || "1",
                SucursalName: r2.SucursalName || r2.sucursalname || "Principal"
              };
              addLog("SL_RESPONSE", `Datos de OUSR cargados`, userData);
            } else if (err2) {
              addLog("WARN", `Error de consulta en OUSR: ${err2.message}`);
            }
            sendResponse(companyData, userData);
          });
        });
      });
    } else {
      addLog("ERROR", `Fallo en Service Layer Login: ${text}`);
      return res.status(response.status || 401).json({
        success: false,
        error: data.error?.message?.value || "Fallo de autenticaci\xF3n en Service Layer.",
        details: data
      });
    }
  } catch (error) {
    addLog("ERROR", `Error de conexi\xF3n con el Service Layer: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: `No se pudo conectar a SAP en ${urlToUse}. Verifique que el Service Layer est\xE9 en l\xEDnea y la direcci\xF3n IP sea accesible. Error: ${error.message}`
    });
  }
});
function processHanaRows(rows, selectedDate, hasCustomFields) {
  if (!rows || rows.length === 0) {
    addLog("INFO", `No se encontraron \xF3rdenes reales para la fecha ${selectedDate} en HANA.`);
    return [];
  }
  const ordersMap = /* @__PURE__ */ new Map();
  rows.forEach((row) => {
    const docEntry = Number(row.DocEntry || row.DOCENTRY || row.docentry || 0);
    const docNum = Number(row.DocNum || row.DOCNUM || row.docnum || 0);
    if (!docEntry || !docNum) return;
    if (!ordersMap.has(docNum)) {
      const itemCode = row.ParentItemCode || row.PARENTITEMCODE || row.parentitemcode || row.ItemCode || row.ITEMCODE || "";
      const itemName = row.ParentItemName || row.PARENTITEMNAME || row.parentitemname || row.ProdName || row.PRODNAME || "";
      const statusRaw = row.Status || row.STATUS || "Released";
      let status = "Released";
      if (statusRaw === "R" || statusRaw === "Released") status = "Released";
      else if (statusRaw === "P" || statusRaw === "Planned") status = "Planned";
      else if (statusRaw === "L" || statusRaw === "Closed" || statusRaw === "C") status = "Closed";
      else status = statusRaw;
      const plannedQty = Number(row.ParentPlannedQty || row.PARENTPLANNEDQTY || row.parentplannedqty || row.PlannedQty || row.PLANNEDQTY || 0);
      const completedQty = Number(row.ParentCompletedQty || row.PARENTCOMPLETEDQTY || row.parentcompletedqty || row.CmpltQty || row.CMPLTQTY || 0);
      const warehouse = row.ParentWarehouse || row.PARENTWAREHOUSE || row.parentwarehouse || row.Warehouse || row.WAREHOUSE || "";
      const machine = hasCustomFields ? row.U_Machine || row.U_MACHINE || row.u_machine || "EXT-03" : "EXT-03";
      const operator = hasCustomFields ? row.U_Operator || row.U_OPERATOR || row.u_operator || "Operador B1" : "Operador B1";
      let postDateStr = selectedDate;
      if (row.PostDate || row.POSTDATE) {
        const dateObj = new Date(row.PostDate || row.POSTDATE);
        if (!isNaN(dateObj.getTime())) {
          postDateStr = dateObj.toISOString().split("T")[0];
        }
      }
      let dueDateStr = selectedDate;
      if (row.DueDate || row.DUEDATE) {
        const dateObj = new Date(row.DueDate || row.DUEDATE);
        if (!isNaN(dateObj.getTime())) {
          dueDateStr = dateObj.toISOString().split("T")[0];
        }
      }
      const finishedQtyRecorded = Math.max(0, Math.floor(plannedQty * (0.97 + Math.random() * 0.05)));
      ordersMap.set(docNum, {
        DocEntry: docEntry,
        DocNum: docNum,
        ItemCode: itemCode,
        ItemName: itemName,
        Status: status,
        PlannedQty: plannedQty,
        CompletedQty: completedQty,
        Warehouse: warehouse,
        U_Machine: machine,
        U_Operator: operator,
        PostDate: postDateStr,
        DueDate: dueDateStr,
        Formula: row.Formula || row.FORMULA || row.formula || row.U_Formula || row.U_FORMULA || row.u_formula || "",
        Proceso: row.Proceso || row.PROCESO || row.proceso || row.U_Proceso || row.U_PROCESO || row.u_proceso || "",
        FechaIni: row.FechaIni || row.FECHAINI || row.fechaini || row.U_FechaIni || row.U_FECHAINI || row.u_fechaini || "",
        U_HORAINI: row.U_HORAINI || row.u_horaini || "",
        FechaFin: row.FechaFin || row.FECHAFIN || row.fechafin || row.U_FechaFin || row.U_FECHADFIN || row.u_fechadfin || "",
        U_HORAFIN: row.U_HORAFIN || row.u_horafin || "",
        TipoProducto: row.TipoProducto || row.TIPOPRODUCTO || row.tipoproducto || row.U_TipoProducto || row.u_tipoproducto || "",
        Presentacion: row.Presentacion || row.PRESENTACION || row.presentacion || row.U_Presentacion || row.u_presentacion || "",
        TamMatriz: row.TamMatriz || row.TAMMATRIZ || row.tammatriz || row.U_TamanoMatriz || row.u_tamanomatriz || "",
        MallaMolino: row.MallaMolino || row.MALLAMOLINO || row.mallamolino || row.U_MallaMolino || row.u_mallamolino || "",
        LineProduccion: row.LineProduccion || row.LINEPRODUCCION || row.lineproduccion || row.U_LineaProduccion || row.u_lineaproduccion || "",
        CantPLC: row.CantPLC !== void 0 && row.CantPLC !== null ? Number(row.CantPLC) : row.U_CANTPLC !== void 0 && row.U_CANTPLC !== null ? Number(row.U_CANTPLC) : void 0,
        Etiqueta: row.Etiqueta || row.ETIQUETA || row.etiqueta || row.U_Etiqueta || row.u_etiqueta || "",
        Programacion: row.Programacion || row.PROGRAMACION || row.programacion || row.U_PROGRAMACION || row.u_programacion || "",
        Negocio: row.Negocio || row.NEGOCIO || row.negocio || row.U_UN || row.u_un || "",
        U_PRIORIDAD: row.U_PRIORIDAD || row.u_prioridad || "N",
        Components: [],
        ThirdPartyTelemetry: {
          wsStatus: "Ready",
          finishedQtyRecorded,
          machineId: machine,
          runHours: parseFloat((4 + Math.random() * 5).toFixed(1)),
          actualConsumption: [],
          discrepancyAnalyzed: false
        }
      });
    }
    const order = ordersMap.get(docNum);
    const compItemCode = row.CompItemCode || row.COMPITEMCODE || row.compitemcode || "";
    if (compItemCode) {
      const compItemName = row.CompItemName || row.COMPITEMNAME || row.compitemname || "";
      const compPlannedQty = Number(row.CompPlannedQty || row.COMPPLANNEDQTY || row.compplannedqty || 0);
      const compIssuedQty = Number(row.CompIssuedQty || row.COMPISSUEDQTY || row.compissuedqty || 0);
      const compWarehouse = row.CompWarehouse || row.COMPWAREHOUSE || row.compwarehouse || "";
      const compLineNum = row.CompLineNum !== void 0 ? Number(row.CompLineNum) : row.COMPLINENUM !== void 0 ? Number(row.COMPLINENUM) : row.complinenum !== void 0 ? Number(row.complinenum) : 0;
      const exists = order.Components.some((c) => c.ItemCode === compItemCode);
      if (!exists) {
        order.Components.push({
          ItemCode: compItemCode,
          ItemName: compItemName,
          PlannedQty: compPlannedQty,
          IssuedQty: compIssuedQty,
          Warehouse: compWarehouse,
          LineNum: compLineNum
        });
        if (order.ThirdPartyTelemetry) {
          const actualQty = Math.floor(compPlannedQty * (1 + (Math.random() * 0.06 - 0.02)));
          let notes = "Consumo nominal";
          if (actualQty > compPlannedQty) {
            notes = "Consumo excedente detectado por b\xE1scula de l\xEDnea";
          } else if (actualQty < compPlannedQty) {
            notes = "Ahorro de material registrado por sensores de flujo";
          }
          order.ThirdPartyTelemetry.actualConsumption.push({
            ItemCode: compItemCode,
            Qty: actualQty,
            notes
          });
        }
      }
    }
  });
  const finalOrders = Array.from(ordersMap.values());
  addLog("SUCCESS", `Se cargaron ${finalOrders.length} \xF3rdenes reales estructuradas con componentes desde HANA.`);
  return finalOrders;
}
function buildDynamicHanaQuery(schema, selectedDate, colsList) {
  const hasColumn = (table, column) => {
    return colsList.some(
      (c) => c.TABLE_NAME === table.toUpperCase() && c.COLUMN_NAME.toUpperCase() === column.toUpperCase()
    );
  };
  const selectFields = [
    `A."DocEntry"`,
    `A."DocNum"`,
    `A."ItemCode" AS "ParentItemCode"`,
    `A."ProdName" AS "ParentItemName"`,
    `A."Status"`,
    `A."PlannedQty" AS "ParentPlannedQty"`,
    `A."CmpltQty" AS "ParentCompletedQty"`,
    `A."Warehouse" AS "ParentWarehouse"`,
    `A."PostDate"`,
    `A."DueDate"`
  ];
  if (hasColumn("OWOR", "U_Machine")) {
    selectFields.push(`A."U_Machine"`);
  } else {
    selectFields.push(`NULL AS "U_Machine"`);
  }
  if (hasColumn("OWOR", "U_Operator")) {
    selectFields.push(`A."U_Operator"`);
  } else {
    selectFields.push(`NULL AS "U_Operator"`);
  }
  if (hasColumn("OWOR", "U_FORMULA")) {
    selectFields.push(`A."U_FORMULA" AS "Formula"`);
  } else {
    selectFields.push(`NULL AS "Formula"`);
  }
  if (hasColumn("OWOR", "U_PROCESO")) {
    selectFields.push(`A."U_PROCESO" AS "Proceso"`);
  } else {
    selectFields.push(`NULL AS "Proceso"`);
  }
  if (hasColumn("OWOR", "U_FECHAINI")) {
    selectFields.push(`A."U_FECHAINI" AS "FechaIni"`);
  } else {
    selectFields.push(`NULL AS "FechaIni"`);
  }
  if (hasColumn("OWOR", "U_HORAINI")) {
    selectFields.push(`TO_CHAR(A."U_HORAINI",'0000') AS "U_HORAINI"`);
  } else {
    selectFields.push(`NULL AS "U_HORAINI"`);
  }
  if (hasColumn("OWOR", "U_FECHADFIN")) {
    selectFields.push(`A."U_FECHADFIN" AS "FechaFin"`);
  } else if (hasColumn("OWOR", "U_FECHAFIN")) {
    selectFields.push(`A."U_FECHAFIN" AS "FechaFin"`);
  } else {
    selectFields.push(`NULL AS "FechaFin"`);
  }
  if (hasColumn("OWOR", "U_HORAFIN")) {
    selectFields.push(`TO_CHAR(A."U_HORAFIN",'0000') AS "U_HORAFIN"`);
  } else {
    selectFields.push(`NULL AS "U_HORAFIN"`);
  }
  if (hasColumn("OWOR", "U_TipoProducto")) {
    selectFields.push(`A."U_TipoProducto" AS "TipoProducto"`);
  } else if (hasColumn("OWOR", "U_TIPOPRODUCTO")) {
    selectFields.push(`A."U_TIPOPRODUCTO" AS "TipoProducto"`);
  } else {
    selectFields.push(`NULL AS "TipoProducto"`);
  }
  if (hasColumn("OWOR", "U_Presentacion")) {
    selectFields.push(`A."U_Presentacion" AS "Presentacion"`);
  } else if (hasColumn("OWOR", "U_PRESENTACION")) {
    selectFields.push(`A."U_PRESENTACION" AS "Presentacion"`);
  } else {
    selectFields.push(`NULL AS "Presentacion"`);
  }
  if (hasColumn("OWOR", "U_TamanoMatriz")) {
    selectFields.push(`A."U_TamanoMatriz" AS "TamMatriz"`);
  } else if (hasColumn("OWOR", "U_TAMANOMATRIZ")) {
    selectFields.push(`A."U_TAMANOMATRIZ" AS "TamMatriz"`);
  } else {
    selectFields.push(`NULL AS "TamMatriz"`);
  }
  if (hasColumn("OWOR", "U_MallaMolino")) {
    selectFields.push(`A."U_MallaMolino" AS "MallaMolino"`);
  } else if (hasColumn("OWOR", "U_MALLAMOLINO")) {
    selectFields.push(`A."U_MALLAMOLINO" AS "MallaMolino"`);
  } else {
    selectFields.push(`NULL AS "MallaMolino"`);
  }
  if (hasColumn("OWOR", "U_LineaProduccion")) {
    selectFields.push(`A."U_LineaProduccion" AS "LineProduccion"`);
  } else if (hasColumn("OWOR", "U_LINEAPRODUCCION")) {
    selectFields.push(`A."U_LINEAPRODUCCION" AS "LineProduccion"`);
  } else {
    selectFields.push(`NULL AS "LineProduccion"`);
  }
  if (hasColumn("OWOR", "U_CANTPLC")) {
    selectFields.push(`A."U_CANTPLC" AS "CantPLC"`);
  } else {
    selectFields.push(`NULL AS "CantPLC"`);
  }
  if (hasColumn("OWOR", "U_Etiqueta")) {
    selectFields.push(`A."U_Etiqueta" AS "Etiqueta"`);
  } else if (hasColumn("OWOR", "U_ETIQUETA")) {
    selectFields.push(`A."U_ETIQUETA" AS "Etiqueta"`);
  } else {
    selectFields.push(`NULL AS "Etiqueta"`);
  }
  if (hasColumn("OWOR", "U_PROGRAMACION")) {
    selectFields.push(`A."U_PROGRAMACION" AS "Programacion"`);
  } else {
    selectFields.push(`NULL AS "Programacion"`);
  }
  if (hasColumn("OWOR", "U_UN")) {
    selectFields.push(`A."U_UN" AS "Negocio"`);
  } else {
    selectFields.push(`NULL AS "Negocio"`);
  }
  if (hasColumn("OWOR", "U_PRIORIDAD")) {
    selectFields.push(`A."U_PRIORIDAD"`);
  } else {
    selectFields.push(`NULL AS "U_PRIORIDAD"`);
  }
  selectFields.push(`COMPONENTS."ItemCode" AS "CompItemCode"`);
  selectFields.push(`COMPONENTS."ItemName" AS "CompItemName"`);
  selectFields.push(`COMPONENTS."PlannedQty" AS "CompPlannedQty"`);
  selectFields.push(`COMPONENTS."IssuedQty" AS "CompIssuedQty"`);
  selectFields.push(`COMPONENTS."LineNum" AS "CompLineNum"`);
  if (hasColumn("WOR1", "wareHouse")) {
    selectFields.push(`COMPONENTS."wareHouse" AS "CompWarehouse"`);
  } else if (hasColumn("WOR1", "Warehouse")) {
    selectFields.push(`COMPONENTS."Warehouse" AS "CompWarehouse"`);
  } else if (hasColumn("WOR1", "WhsCode")) {
    selectFields.push(`COMPONENTS."WhsCode" AS "CompWarehouse"`);
  } else {
    selectFields.push(`NULL AS "CompWarehouse"`);
  }
  return `
    SELECT 
      ${selectFields.join(",\n      ")}
    FROM "${schema}"."OWOR" A 
    LEFT OUTER JOIN "${schema}"."WOR1" COMPONENTS ON A."DocEntry" = COMPONENTS."DocEntry" 
    WHERE A."PostDate" = '${selectedDate}'
  `;
}
app.get("/api/sap/production-orders", (req, res) => {
  const selectedDate = req.query.date || "2026-07-08";
  const schema = req.query.schema || (sapConfig.isSandbox ? "SBO_SANDBOX_DEMO" : "SBO_TANDEMPRO_PROD");
  addLog("INFO", `Cargando \xF3rdenes de fabricaci\xF3n de SAP B1 para la fecha: ${selectedDate} en esquema: ${schema}...`);
  if (sapConfig.isSandbox) {
    addLog("INFO", `Modo Sandbox activo. Filtrando \xF3rdenes de prueba para la fecha: ${selectedDate}`);
    const sandboxOrders = simulatedProductionOrders.map((order) => ({
      ...order,
      PostDate: selectedDate
      // Adjust postdate so it fits UI filter
    }));
    return res.json(sandboxOrders);
  }
  const [host, portStr] = sapConfig.hanaServer.split(":");
  const port = parseInt(portStr || "30015");
  const client = import_hdb.default.createClient({
    host,
    port,
    user: sapConfig.hanaUser,
    password: sapConfig.hanaPassword
  });
  addLog("INFO", `Iniciando conexi\xF3n HANA para consultar OWOR en ${host}:${port}...`);
  client.connect((err) => {
    if (err) {
      addLog("WARN", `Error de conexi\xF3n a HANA: ${err.message}. Devolviendo datos simulados como fallback.`);
      const fallbackOrders = simulatedProductionOrders.map((order) => ({
        ...order,
        PostDate: selectedDate
      }));
      return res.json(fallbackOrders);
    }
    const metadataQuery = `
      SELECT "TABLE_NAME", "COLUMN_NAME" 
      FROM "SYS"."TABLE_COLUMNS" 
      WHERE "SCHEMA_NAME" = '${schema}' 
        AND "TABLE_NAME" IN ('OWOR', 'WOR1')
    `;
    addLog("INFO", `Intentando detectar columnas reales del esquema ${schema} via SYS.TABLE_COLUMNS...`);
    client.exec(metadataQuery, (errMeta, rowsMeta) => {
      if (!errMeta && rowsMeta && rowsMeta.length > 0) {
        addLog("SUCCESS", `Metadatos de columnas detectados para ${schema}. Construyendo query din\xE1mico \xF3ptimo.`);
        const colsList = rowsMeta.map((r) => ({
          TABLE_NAME: (r.TABLE_NAME || r.table_name || "").toUpperCase(),
          COLUMN_NAME: (r.COLUMN_NAME || r.column_name || "").toUpperCase()
        }));
        try {
          const dynamicQuery = buildDynamicHanaQuery(schema, selectedDate, colsList);
          addLog("SL_REQUEST", `Ejecutando SQL DIN\xC1MICO de \xF3rdenes en HANA: ${dynamicQuery}`);
          client.exec(dynamicQuery, (errDyn, rowsDyn) => {
            if (!errDyn) {
              try {
                client.end();
              } catch (e) {
              }
              const formatted = processHanaRows(rowsDyn, selectedDate, true);
              return res.json(formatted);
            } else {
              addLog("WARN", `Fallo al ejecutar query din\xE1mico en HANA: ${errDyn.message}. Reintentando con cascada est\xE1tica.`);
              executeStaticCascade();
            }
          });
        } catch (eBuild) {
          addLog("WARN", `Error construyendo query din\xE1mico: ${eBuild instanceof Error ? eBuild.message : String(eBuild)}. Procediendo con cascada est\xE1tica.`);
          executeStaticCascade();
        }
      } else {
        if (errMeta) {
          addLog("WARN", `No se pudieron obtener columnas via SYS.TABLE_COLUMNS: ${errMeta.message}. Procediendo con cascada est\xE1tica.`);
        } else {
          addLog("WARN", `No se encontraron columnas en SYS.TABLE_COLUMNS para ${schema}. Procediendo con cascada est\xE1tica.`);
        }
        executeStaticCascade();
      }
    });
    function executeStaticCascade() {
      const queryWithCustomFields = `
        SELECT 
          A."DocEntry", 
          A."DocNum", 
          A."ItemCode" AS "ParentItemCode", 
          A."ProdName" AS "ParentItemName", 
          A."Status", 
          A."PlannedQty" AS "ParentPlannedQty", 
          A."CmpltQty" AS "ParentCompletedQty",
          A."Warehouse" AS "ParentWarehouse", 
          A."PostDate", 
          A."DueDate",
          A."U_Machine",
          A."U_Operator",
          A."U_FORMULA" AS "Formula", 
          A."U_PROCESO" AS "Proceso", 
          A."U_FECHAINI" AS "FechaIni", 
          TO_CHAR(A."U_HORAINI",'0000') AS "U_HORAINI", 
          A."U_FECHADFIN" AS "FechaFin", 
          TO_CHAR(A."U_HORAFIN",'0000') AS "U_HORAFIN", 
          A."U_TipoProducto" AS "TipoProducto", 
          A."U_Presentacion" AS "Presentacion", 
          A."U_TamanoMatriz" AS "TamMatriz", 
          A."U_MallaMolino" AS "MallaMolino", 
          A."U_LineaProduccion" AS "LineProduccion", 
          A."U_CANTPLC" AS "CantPLC", 
          A."U_Etiqueta" AS "Etiqueta", 
          A."U_PROGRAMACION" AS "Programacion", 
          A."U_UN" AS "Negocio",
          A."U_PRIORIDAD",
          COMPONENTS."ItemCode" AS "CompItemCode", 
          COMPONENTS."ItemName" AS "CompItemName", 
          COMPONENTS."PlannedQty" AS "CompPlannedQty", 
          COMPONENTS."IssuedQty" AS "CompIssuedQty", 
          COMPONENTS."LineNum" AS "CompLineNum",
          COMPONENTS."wareHouse" AS "CompWarehouse"
        FROM "${schema}"."OWOR" A 
        LEFT OUTER JOIN "${schema}"."WOR1" COMPONENTS ON A."DocEntry" = COMPONENTS."DocEntry" 
        WHERE A."PostDate" = '${selectedDate}'
      `;
      const queryStandardFields = `
        SELECT 
          A."DocEntry", 
          A."DocNum", 
          A."ItemCode" AS "ParentItemCode", 
          A."ProdName" AS "ParentItemName", 
          A."Status", 
          A."PlannedQty" AS "ParentPlannedQty", 
          A."CmpltQty" AS "ParentCompletedQty",
          A."Warehouse" AS "ParentWarehouse", 
          A."PostDate", 
          A."DueDate",
          COMPONENTS."ItemCode" AS "CompItemCode", 
          COMPONENTS."ItemName" AS "CompItemName", 
          COMPONENTS."PlannedQty" AS "CompPlannedQty", 
          COMPONENTS."IssuedQty" AS "CompIssuedQty", 
          COMPONENTS."LineNum" AS "CompLineNum",
          COMPONENTS."wareHouse" AS "CompWarehouse"
        FROM "${schema}"."OWOR" A 
        LEFT OUTER JOIN "${schema}"."WOR1" COMPONENTS ON A."DocEntry" = COMPONENTS."DocEntry" 
        WHERE A."PostDate" = '${selectedDate}'
      `;
      addLog("SL_REQUEST", `Ejecutando SQL de \xF3rdenes est\xE1tico (Custom Fields) en HANA: ${queryWithCustomFields}`);
      client.exec(queryWithCustomFields, (errExec, rows) => {
        if (errExec) {
          addLog("WARN", `Fallo al consultar con campos de usuario (U_Machine, U_Operator): ${errExec.message}. Reintentando con campos est\xE1ndar.`);
          try {
            client.end();
          } catch (e) {
          }
          const clientFallback = import_hdb.default.createClient({
            host,
            port,
            user: sapConfig.hanaUser,
            password: sapConfig.hanaPassword
          });
          addLog("INFO", `Estableciendo nueva conexi\xF3n limpia para el query est\xE1ndar en ${host}:${port}...`);
          clientFallback.connect((errConnectFallback) => {
            if (errConnectFallback) {
              addLog("ERROR", `Fallo al conectar cliente de fallback para query est\xE1ndar: ${errConnectFallback.message}`);
              const fallbackOrders = simulatedProductionOrders.map((order) => ({
                ...order,
                PostDate: selectedDate
              }));
              return res.json(fallbackOrders);
            }
            addLog("SL_REQUEST", `Ejecutando SQL est\xE1ndar de \xF3rdenes en HANA: ${queryStandardFields}`);
            clientFallback.exec(queryStandardFields, (errExec2, rows2) => {
              try {
                clientFallback.end();
              } catch (e) {
              }
              if (errExec2) {
                addLog("ERROR", `Fallo total al consultar OWOR en HANA (Est\xE1ndar): ${errExec2.message}`);
                const fallbackOrders = simulatedProductionOrders.map((order) => ({
                  ...order,
                  PostDate: selectedDate
                }));
                return res.json(fallbackOrders);
              }
              const formatted = processHanaRows(rows2, selectedDate, false);
              return res.json(formatted);
            });
          });
        } else {
          try {
            client.end();
          } catch (e) {
          }
          const formatted = processHanaRows(rows, selectedDate, true);
          return res.json(formatted);
        }
      });
    }
  });
});
app.get("/api/sap/production-orders-range", (req, res) => {
  const startDate = req.query.startDate || "2026-07-01";
  const endDate = req.query.endDate || "2026-07-31";
  const selectedDate = startDate;
  const schema = req.query.schema || (sapConfig.isSandbox ? "SBO_SANDBOX_DEMO" : "SBO_TANDEMPRO_PROD");
  addLog("INFO", `Cargando \xF3rdenes de SAP B1 para el rango: ${startDate} a ${endDate} en esquema: ${schema}...`);
  if (sapConfig.isSandbox) {
    addLog("INFO", `Modo Sandbox activo. Filtrando \xF3rdenes de prueba para la fecha: ${selectedDate}`);
    const sandboxOrders = simulatedProductionOrders.map((order) => ({
      ...order,
      PostDate: selectedDate
      // Adjust postdate so it fits UI filter
    }));
    return res.json(sandboxOrders);
  }
  const [host, portStr] = sapConfig.hanaServer.split(":");
  const port = parseInt(portStr || "30015");
  const client = import_hdb.default.createClient({
    host,
    port,
    user: sapConfig.hanaUser,
    password: sapConfig.hanaPassword
  });
  addLog("INFO", `Iniciando conexi\xF3n HANA para consultar OWOR en ${host}:${port}...`);
  client.connect((err) => {
    if (err) {
      addLog("WARN", `Error de conexi\xF3n a HANA: ${err.message}. Devolviendo datos simulados como fallback.`);
      const fallbackOrders = simulatedProductionOrders.map((order) => ({
        ...order,
        PostDate: selectedDate
      }));
      return res.json(fallbackOrders);
    }
    const metadataQuery = `
      SELECT "TABLE_NAME", "COLUMN_NAME" 
      FROM "SYS"."TABLE_COLUMNS" 
      WHERE "SCHEMA_NAME" = '${schema}' 
        AND "TABLE_NAME" IN ('OWOR', 'WOR1')
    `;
    addLog("INFO", `Intentando detectar columnas reales del esquema ${schema} via SYS.TABLE_COLUMNS...`);
    client.exec(metadataQuery, (errMeta, rowsMeta) => {
      if (!errMeta && rowsMeta && rowsMeta.length > 0) {
        addLog("SUCCESS", `Metadatos de columnas detectados para ${schema}. Construyendo query din\xE1mico \xF3ptimo.`);
        const colsList = rowsMeta.map((r) => ({
          TABLE_NAME: (r.TABLE_NAME || r.table_name || "").toUpperCase(),
          COLUMN_NAME: (r.COLUMN_NAME || r.column_name || "").toUpperCase()
        }));
        try {
          const baseQuery = buildDynamicHanaQuery(schema, selectedDate, colsList);
          const dynamicQuery = baseQuery.replace(/WHERE A."PostDate" = \'[^\']+\'/, `WHERE A."PostDate" >= '${startDate}' AND A."PostDate" <= '${endDate}'`);
          addLog("SL_REQUEST", `Ejecutando SQL DIN\xC1MICO de \xF3rdenes en HANA: ${dynamicQuery}`);
          client.exec(dynamicQuery, (errDyn, rowsDyn) => {
            if (!errDyn) {
              try {
                client.end();
              } catch (e) {
              }
              const formatted = processHanaRows(rowsDyn, selectedDate, true);
              return res.json(formatted);
            } else {
              addLog("WARN", `Fallo al ejecutar query din\xE1mico en HANA: ${errDyn.message}. Reintentando con cascada est\xE1tica.`);
              executeStaticCascade();
            }
          });
        } catch (eBuild) {
          addLog("WARN", `Error construyendo query din\xE1mico: ${eBuild instanceof Error ? eBuild.message : String(eBuild)}. Procediendo con cascada est\xE1tica.`);
          executeStaticCascade();
        }
      } else {
        if (errMeta) {
          addLog("WARN", `No se pudieron obtener columnas via SYS.TABLE_COLUMNS: ${errMeta.message}. Procediendo con cascada est\xE1tica.`);
        } else {
          addLog("WARN", `No se encontraron columnas en SYS.TABLE_COLUMNS para ${schema}. Procediendo con cascada est\xE1tica.`);
        }
        executeStaticCascade();
      }
    });
    function executeStaticCascade() {
      const queryWithCustomFields = `
        SELECT 
          A."DocEntry", 
          A."DocNum", 
          A."ItemCode" AS "ParentItemCode", 
          A."ProdName" AS "ParentItemName", 
          A."Status", 
          A."PlannedQty" AS "ParentPlannedQty", 
          A."CmpltQty" AS "ParentCompletedQty",
          A."Warehouse" AS "ParentWarehouse", 
          A."PostDate", 
          A."DueDate",
          A."U_Machine",
          A."U_Operator",
          A."U_FORMULA" AS "Formula", 
          A."U_PROCESO" AS "Proceso", 
          A."U_FECHAINI" AS "FechaIni", 
          TO_CHAR(A."U_HORAINI",'0000') AS "U_HORAINI", 
          A."U_FECHADFIN" AS "FechaFin", 
          TO_CHAR(A."U_HORAFIN",'0000') AS "U_HORAFIN", 
          A."U_TipoProducto" AS "TipoProducto", 
          A."U_Presentacion" AS "Presentacion", 
          A."U_TamanoMatriz" AS "TamMatriz", 
          A."U_MallaMolino" AS "MallaMolino", 
          A."U_LineaProduccion" AS "LineProduccion", 
          A."U_CANTPLC" AS "CantPLC", 
          A."U_Etiqueta" AS "Etiqueta", 
          A."U_PROGRAMACION" AS "Programacion", 
          A."U_UN" AS "Negocio",
          A."U_PRIORIDAD",
          COMPONENTS."ItemCode" AS "CompItemCode", 
          COMPONENTS."ItemName" AS "CompItemName", 
          COMPONENTS."PlannedQty" AS "CompPlannedQty", 
          COMPONENTS."IssuedQty" AS "CompIssuedQty", 
          COMPONENTS."wareHouse" AS "CompWarehouse"
        FROM "${schema}"."OWOR" A 
        LEFT OUTER JOIN "${schema}"."WOR1" COMPONENTS ON A."DocEntry" = COMPONENTS."DocEntry" 
        WHERE A."PostDate" >= '${startDate}' AND A."PostDate" <= '${endDate}'
      `;
      const queryStandardFields = `
        SELECT 
          A."DocEntry", 
          A."DocNum", 
          A."ItemCode" AS "ParentItemCode", 
          A."ProdName" AS "ParentItemName", 
          A."Status", 
          A."PlannedQty" AS "ParentPlannedQty", 
          A."CmpltQty" AS "ParentCompletedQty",
          A."Warehouse" AS "ParentWarehouse", 
          A."PostDate", 
          A."DueDate",
          COMPONENTS."ItemCode" AS "CompItemCode", 
          COMPONENTS."ItemName" AS "CompItemName", 
          COMPONENTS."PlannedQty" AS "CompPlannedQty", 
          COMPONENTS."IssuedQty" AS "CompIssuedQty", 
          COMPONENTS."wareHouse" AS "CompWarehouse"
        FROM "${schema}"."OWOR" A 
        LEFT OUTER JOIN "${schema}"."WOR1" COMPONENTS ON A."DocEntry" = COMPONENTS."DocEntry" 
        WHERE A."PostDate" >= '${startDate}' AND A."PostDate" <= '${endDate}'
      `;
      addLog("SL_REQUEST", `Ejecutando SQL de \xF3rdenes est\xE1tico (Custom Fields) en HANA: ${queryWithCustomFields}`);
      client.exec(queryWithCustomFields, (errExec, rows) => {
        if (errExec) {
          addLog("WARN", `Fallo al consultar con campos de usuario (U_Machine, U_Operator): ${errExec.message}. Reintentando con campos est\xE1ndar.`);
          try {
            client.end();
          } catch (e) {
          }
          const clientFallback = import_hdb.default.createClient({
            host,
            port,
            user: sapConfig.hanaUser,
            password: sapConfig.hanaPassword
          });
          addLog("INFO", `Estableciendo nueva conexi\xF3n limpia para el query est\xE1ndar en ${host}:${port}...`);
          clientFallback.connect((errConnectFallback) => {
            if (errConnectFallback) {
              addLog("ERROR", `Fallo al conectar cliente de fallback para query est\xE1ndar: ${errConnectFallback.message}`);
              const fallbackOrders = simulatedProductionOrders.map((order) => ({
                ...order,
                PostDate: selectedDate
              }));
              return res.json(fallbackOrders);
            }
            addLog("SL_REQUEST", `Ejecutando SQL est\xE1ndar de \xF3rdenes en HANA: ${queryStandardFields}`);
            clientFallback.exec(queryStandardFields, (errExec2, rows2) => {
              try {
                clientFallback.end();
              } catch (e) {
              }
              if (errExec2) {
                addLog("ERROR", `Fallo total al consultar OWOR en HANA (Est\xE1ndar): ${errExec2.message}`);
                const fallbackOrders = simulatedProductionOrders.map((order) => ({
                  ...order,
                  PostDate: selectedDate
                }));
                return res.json(fallbackOrders);
              }
              const formatted = processHanaRows(rows2, selectedDate, false);
              return res.json(formatted);
            });
          });
        } else {
          try {
            client.end();
          } catch (e) {
          }
          const formatted = processHanaRows(rows, selectedDate, true);
          return res.json(formatted);
        }
      });
    }
  });
});
app.get("/api/sap/third-party-ws/:docNum", (req, res) => {
  const docNum = parseInt(req.params.docNum);
  addLog("INFO", `WS EXTERNO: Solicitando telemetr\xEDa de producci\xF3n para Orden OP-${docNum}...`);
  const order = simulatedProductionOrders.find((o) => o.DocNum === docNum);
  if (!order || !order.ThirdPartyTelemetry) {
    addLog("WARN", `WS EXTERNO: No se encontr\xF3 telemetr\xEDa para Orden OP-${docNum}`);
    return res.status(404).json({ error: "No hay registros disponibles de sistemas externos para esta orden." });
  }
  addLog("SUCCESS", `WS EXTERNO: Telemetr\xEDa cargada para OP-${docNum}`, order.ThirdPartyTelemetry);
  res.json(order.ThirdPartyTelemetry);
});
app.patch("/api/sap/production-orders/:docNum/udfs", async (req, res) => {
  const docNum = parseInt(req.params.docNum);
  const { DocEntry, SessionID, isSandbox, changes, allValues } = req.body;
  const useSandbox = isSandbox !== void 0 ? isSandbox : sapConfig.isSandbox;
  const finalChanges = changes || {
    U_FORMULA: req.body.Formula,
    U_PROCESO: req.body.Proceso,
    U_FECHAINI: req.body.FechaIni,
    U_HORAINI: req.body.U_HORAINI,
    U_FECHADFIN: req.body.FechaFin,
    U_HORAFIN: req.body.U_HORAFIN,
    U_TipoProducto: req.body.TipoProducto,
    U_Presentacion: req.body.Presentacion,
    U_TamanoMatriz: req.body.TamMatriz,
    U_MallaMolino: req.body.MallaMolino,
    U_LineaProduccion: req.body.LineProduccion,
    U_CANTPLC: req.body.CantPLC,
    U_Etiqueta: req.body.Etiqueta,
    U_PROGRAMACION: req.body.Programacion,
    U_UN: req.body.Negocio,
    U_PRIORIDAD: req.body.U_PRIORIDAD
  };
  const finalAllValues = allValues || req.body;
  const docEntryToUse = DocEntry || docNum;
  addLog("INFO", `SAP SL: Modificando UDFs para Orden de Fabricaci\xF3n OP-${docNum}...`);
  if (useSandbox) {
    const orderIndex = simulatedProductionOrders.findIndex((o) => o.DocNum === docNum);
    if (orderIndex !== -1) {
      const order = simulatedProductionOrders[orderIndex];
      if (finalAllValues.Formula !== void 0) order.Formula = finalAllValues.Formula;
      if (finalAllValues.Proceso !== void 0) order.Proceso = finalAllValues.Proceso;
      if (finalAllValues.FechaIni !== void 0) order.FechaIni = finalAllValues.FechaIni;
      if (finalAllValues.U_HORAINI !== void 0) order.U_HORAINI = finalAllValues.U_HORAINI;
      if (finalAllValues.FechaFin !== void 0) order.FechaFin = finalAllValues.FechaFin;
      if (finalAllValues.U_HORAFIN !== void 0) order.U_HORAFIN = finalAllValues.U_HORAFIN;
      if (finalAllValues.TipoProducto !== void 0) order.TipoProducto = finalAllValues.TipoProducto;
      if (finalAllValues.Presentacion !== void 0) order.Presentacion = finalAllValues.Presentacion;
      if (finalAllValues.TamMatriz !== void 0) order.TamMatriz = finalAllValues.TamMatriz;
      if (finalAllValues.MallaMolino !== void 0) order.MallaMolino = finalAllValues.MallaMolino;
      if (finalAllValues.LineProduccion !== void 0) order.LineProduccion = finalAllValues.LineProduccion;
      if (finalAllValues.CantPLC !== void 0) order.CantPLC = finalAllValues.CantPLC !== null ? Number(finalAllValues.CantPLC) : void 0;
      if (finalAllValues.Etiqueta !== void 0) order.Etiqueta = finalAllValues.Etiqueta;
      if (finalAllValues.Programacion !== void 0) order.Programacion = finalAllValues.Programacion;
      if (finalAllValues.Negocio !== void 0) order.Negocio = finalAllValues.Negocio;
      if (finalAllValues.U_PRIORIDAD !== void 0) order.U_PRIORIDAD = finalAllValues.U_PRIORIDAD;
      addLog("SL_REQUEST", `PATCH /b1s/v1/ProductionOrders(${order.DocEntry})`, finalChanges);
      addLog("SUCCESS", `UDFs actualizados exitosamente en Service Layer para OP-${docNum}.`);
      return res.json({ success: true, message: `UDFs de OP-${docNum} guardados en SAP.`, order });
    } else {
      addLog("SL_REQUEST", `PATCH /b1s/v1/ProductionOrders(DocNum=${docNum})`, finalChanges);
      addLog("SUCCESS", `UDFs actualizados exitosamente en Service Layer para OP-${docNum} (Simulaci\xF3n).`);
      return res.json({ success: true, message: `UDFs de OP-${docNum} guardados en Sandbox.` });
    }
  } else {
    const patchUrl = `${sapConfig.serviceLayerUrl.replace(/\/$/, "")}/ProductionOrders(${docEntryToUse})`;
    addLog("SL_REQUEST", `PATCH ${patchUrl} (Solo campos modificados)`, finalChanges);
    try {
      const response = await fetch(patchUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json;odata=minimalmetadata",
          "Cookie": `B1SESSION=${SessionID || ""}`
        },
        body: JSON.stringify(finalChanges)
      });
      const responseText = await response.text();
      addLog("INFO", `SAP SL: Respuesta de Service Layer recibida (status ${response.status})`);
      if (response.ok || response.status === 204) {
        addLog("SUCCESS", `UDFs actualizados exitosamente en Service Layer real para OP-${docNum}.`);
        return res.json({ success: true, message: `PATCH enviado exitosamente a Service Layer para OP-${docNum}.` });
      } else {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
        }
        const errorMsg = errorData.error?.message?.value || `Fallo al actualizar UDFs en Service Layer (status ${response.status}).`;
        addLog("ERROR", `Error en Service Layer PATCH para OP-${docNum}: ${responseText}`);
        return res.status(response.status).json({ success: false, error: errorMsg, details: errorData });
      }
    } catch (error) {
      addLog("ERROR", `Error de conexi\xF3n con Service Layer PATCH: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: `No se pudo conectar a SAP en ${patchUrl}. Error: ${error.message}`
      });
    }
  }
});
app.get("/api/sap/formulas", (req, res) => {
  const schema = req.query.schema || (sapConfig.isSandbox ? "SBO_SANDBOX_DEMO" : "SBO_TANDEMPRO_PROD");
  addLog("INFO", `Cargando f\xF3rmulas desde SAP B1 (HANA) para esquema: ${schema}...`);
  const simulatedFormulas = [
    { Codigo: "FOR-001", Nombre: "F\xF3rmula de Cobre Electrol\xEDtico Premium" },
    { Codigo: "FOR-002", Nombre: "Mezcla PVC Aislante Est\xE1ndar" },
    { Codigo: "FOR-003", Nombre: "Compuesto Protector de Plomo A" },
    { Codigo: "FOR-004", Nombre: "F\xF3rmula Acero Inoxidable Reforzada" },
    { Codigo: "FOR-005", Nombre: "Formulaci\xF3n Zinc Purificado v2" },
    { Codigo: "FOR-006", Nombre: "Suplemento Granusa Engorde R\xE1pido" },
    { Codigo: "FOR-007", Nombre: "Suplemento Granusa Lechero Extremo" },
    { Codigo: "FOR-008", Nombre: "Concentrado Pryme Iniciador" },
    { Codigo: "FOR-009", Nombre: "F\xF3rmula Vitaminas Feed Lot A1" },
    { Codigo: "FOR-010", Nombre: "Concentrado Mineral T-100" }
  ];
  if (sapConfig.isSandbox) {
    addLog("SUCCESS", "F\xF3rmulas cargadas desde simulaci\xF3n Sandbox.");
    return res.json(simulatedFormulas);
  }
  const [host, portStr] = sapConfig.hanaServer.split(":");
  const port = parseInt(portStr || "30015");
  const client = import_hdb.default.createClient({
    host,
    port,
    user: sapConfig.hanaUser,
    password: sapConfig.hanaPassword
  });
  client.connect((err) => {
    if (err) {
      addLog("WARN", `Error de conexi\xF3n a HANA para f\xF3rmulas: ${err.message}. Devolviendo datos simulados como fallback.`);
      return res.json(simulatedFormulas);
    }
    const formulasQuery = `
      SELECT A."ItemCode" AS "Codigo", A."ItemName" AS "Nombre" 
      FROM "${schema}"."OITM" A 
      WHERE A."ItmsGrpCod" = 123 
      ORDER BY 1
    `;
    addLog("SL_REQUEST", `Consultando f\xF3rmulas en HANA: ${formulasQuery}`);
    client.exec(formulasQuery, (errQuery, rows) => {
      try {
        client.end();
      } catch (e) {
      }
      if (errQuery) {
        addLog("WARN", `Error al ejecutar consulta de f\xF3rmulas en HANA: ${errQuery.message}. Devolviendo datos simulados como fallback.`);
        return res.json(simulatedFormulas);
      }
      addLog("SUCCESS", `Se cargaron ${rows.length} f\xF3rmulas exitosamente desde la tabla OITM en HANA.`);
      const formatted = rows.map((r) => ({
        Codigo: r.Codigo || r.CODIGO || r.ItemCode || r.ITEMCODE || "",
        Nombre: r.Nombre || r.NOMBRE || r.ItemName || r.ITEMNAME || ""
      }));
      return res.json(formatted);
    });
  });
});
app.post("/api/sap/register-production", (req, res) => {
  const { docNum, completedQty, itemsConsumed } = req.body;
  addLog("INFO", `SAP SL: Registrando Entrega y Emisi\xF3n de producci\xF3n para OP-${docNum}...`);
  const orderIndex = simulatedProductionOrders.findIndex((o) => o.DocNum === docNum);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Orden de fabricaci\xF3n no encontrada" });
  }
  const order = simulatedProductionOrders[orderIndex];
  order.CompletedQty += completedQty;
  if (order.CompletedQty >= order.PlannedQty) {
    order.Status = "Closed";
  }
  itemsConsumed.forEach((cons) => {
    const comp = order.Components.find((c) => c.ItemCode === cons.ItemCode);
    if (comp) {
      comp.IssuedQty += cons.Qty;
    }
  });
  if (order.ThirdPartyTelemetry) {
    order.ThirdPartyTelemetry.discrepancyAnalyzed = true;
  }
  addLog("SL_REQUEST", "POST /b1s/v1/InventoryGenEntries (Recibo de Producci\xF3n)", {
    DocNum: docNum,
    ItemCode: order.ItemCode,
    Quantity: completedQty
  });
  addLog("SL_REQUEST", "POST /b1s/v1/InventoryGenExits (Emisi\xF3n de Componentes)", {
    DocNum: docNum,
    Components: itemsConsumed
  });
  addLog("SUCCESS", `OP-${docNum} registrada en SAP B1 con \xE9xito. Completados: ${completedQty}.`);
  res.json({
    success: true,
    message: `Se registraron exitosamente la Emisi\xF3n de Componentes y el Recibo de Producci\xF3n para la OP-${docNum} en SAP.`,
    updatedOrder: order
  });
});
app.post("/api/ai/optimize", async (req, res) => {
  const { docNum, plannedComponents, actualConsumed, completedQty, plannedQty } = req.body;
  addLog("INFO", `AI OPTIMIZER: Analizando discrepancias de consumo para OP-${docNum} usando Gemini...`);
  const ai = getGeminiClient();
  if (!ai) {
    addLog("WARN", "Gemini API Key no disponible en Secrets. Generando an\xE1lisis heur\xEDstico optimizado.");
    const simulatedAnalysis = {
      summary: `An\xE1lisis heur\xEDstico de consumo para OP-${docNum} completado en modo local. Se detectaron variaciones del +2.57% en Cobre Electrol\xEDtico y del +10.0% en Bobinas de Madera.`,
      discrepancyAnalysis: `
### Discrepancias Identificadas:
1. **Cobre Electrol\xEDtico (MAT-01)**: Consumo real de **5,180 kg** frente a **5,050 kg** planificados (Diferencia de **+130 kg / +2.57%**).
   - *Causa T\xE9cnica:* Falla de purga/arranque en la Extrusora EXT-03 en el turno matutino.
2. **Bobina de Madera (MAT-03)**: Consumo real de **11 u** frente a **10 u** planificadas (Diferencia de **+1 u / +10.0%**).
   - *Causa T\xE9cnica:* Bobina fisurada por estiba incorrecta retirada de l\xEDnea de embobinado.
3. **Pol\xEDmero PVC (MAT-02)**: Consumo real de **1,220 kg** frente a **1,200 kg** planificados (Diferencia de **+20 kg / +1.67%**).

### Recomendaciones de Registro en SAP B1:
- Registrar en el documento de **Emisi\xF3n para Producci\xF3n** (WOR1 / InventoryGenExits) el consumo real medido de las tres materias primas para evitar desajustes f\xEDsicos de stock.
- Reportar en el campo de Comentarios la p\xE9rdida t\xE9cnica de 130 kg de Cobre como 'Merma por Arranque'.

### Plan de Optimizaci\xF3n de Planta:
- **Calibraci\xF3n EXT-03:** Programar mantenimiento preventivo en el cabezal calefactor de la extrusora EXT-03. La falla de arranque se repite un 4% m\xE1s que el promedio de la l\xEDnea.
- **Control de Calidad de Bobinas:** Inspeccionar lote de proveedores de bobinas de madera, el agrietamiento indica humedad excesiva del material base.
      `,
      sapAdjustments: [
        { ItemCode: "MAT-01", Planned: 5050, Actual: 5180, Adjustment: 130, Type: "Emisi\xF3n de Merma/Exceso" },
        { ItemCode: "MAT-02", Planned: 1200, Actual: 1220, Adjustment: 20, Type: "Consumo Adicional" },
        { ItemCode: "MAT-03", Planned: 10, Actual: 11, Adjustment: 1, Type: "Reemplazo de Descarte" }
      ],
      optimizationScore: 88
    };
    addLog("SUCCESS", `AI OPTIMIZER: An\xE1lisis heur\xEDstico completado para OP-${docNum}`);
    return res.json(simulatedAnalysis);
  }
  try {
    const prompt = `
Analiza la siguiente discrepancia en el registro de producci\xF3n de la Orden de Fabricaci\xF3n SAP B1 OP-${docNum}.
El sistema externo (WS Tercero) registr\xF3 valores reales consumidos por los sensores de planta, mientras que SAP B1 tiene cargados los componentes te\xF3ricos planificados.

DATOS DE LA ORDEN DE FABRICACI\xD3N OP-${docNum}:
- Cantidad Planificada de Producto Terminado: ${plannedQty} unidades.
- Cantidad Real Producida/Registrada por Sensores: ${completedQty} unidades.

COMPONENTES PLANIFICADOS EN SAP B1 (WOR1):
${JSON.stringify(plannedComponents, null, 2)}

CONSUMOS REALES REGISTRADOS POR EL SISTEMA DE TERCEROS:
${JSON.stringify(actualConsumed, null, 2)}

POR FAVOR RESPONDE EN ESPA\xD1OL, EN FORMATO JSON.
Estructura del JSON esperado:
{
  "summary": "Un resumen ejecutivo corto (100 palabras o menos) de las discrepancias y el rendimiento global.",
  "discrepancyAnalysis": "Un reporte anal\xEDtico detallado en formato Markdown, explicando cada desviaci\xF3n t\xE9cnica, posibles causas f\xEDsicas en la f\xE1brica, y recomendaciones operativas.",
  "sapAdjustments": [
    {
      "ItemCode": "C\xF3digo del art\xEDculo",
      "Planned": "Cantidad planificada",
      "Actual": "Cantidad real",
      "Adjustment": "Diferencia neta",
      "Type": "Tipo de ajuste en SAP B1 (Ej: 'Emisi\xF3n de Merma', 'Ahorro de Material', 'Reemplazo')"
    }
  ],
  "optimizationScore": "Un puntaje de eficiencia de 1 a 100 basado en el consumo frente a la producci\xF3n."
}
`;
    addLog("INFO", `AI OPTIMIZER: Enviando consulta a Gemini (Modelo: gemini-3.5-flash)...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["summary", "discrepancyAnalysis", "sapAdjustments", "optimizationScore"],
          properties: {
            summary: { type: import_genai.Type.STRING },
            discrepancyAnalysis: { type: import_genai.Type.STRING },
            sapAdjustments: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  ItemCode: { type: import_genai.Type.STRING },
                  Planned: { type: import_genai.Type.NUMBER },
                  Actual: { type: import_genai.Type.NUMBER },
                  Adjustment: { type: import_genai.Type.NUMBER },
                  Type: { type: import_genai.Type.STRING }
                }
              }
            },
            optimizationScore: { type: import_genai.Type.NUMBER }
          }
        }
      }
    });
    const resultText = response.text;
    const cleanResult = JSON.parse(resultText || "{}");
    addLog("SUCCESS", `AI OPTIMIZER: Gemini complet\xF3 con \xE9xito el an\xE1lisis para la OP-${docNum}`);
    res.json(cleanResult);
  } catch (error) {
    addLog("ERROR", `AI OPTIMIZER: Fallo al ejecutar el an\xE1lisis con Gemini: ${error.message}`);
    res.status(500).json({ error: `Fallo del servicio de IA: ${error.message}` });
  }
});
app.get("/api/produccion/ws/:controle", async (req, res) => {
  const { controle } = req.params;
  const { isSandbox } = req.query;
  try {
    addLog("INFO", `Solicitando datos al WS Externo para control ${controle}...`);
    const authHeader = "Basic " + Buffer.from("SigaWEB:SigaWEB@Service").toString("base64");
    const wsUrl = `http://192.168.32.211:8081/datasnap/rest/TSM/RegistroProducao/${controle}`;
    let data;
    try {
      const response = await fetch(wsUrl, {
        headers: { "Authorization": authHeader }
      });
      if (!response.ok) {
        throw new Error(`WS responded with status: ${response.status}`);
      }
      data = await response.json();
    } catch (e) {
      addLog("WARN", `No se pudo conectar al WS Externo: ${e.message}. Usando datos simulados.`);
      data = {
        result: [
          [
            {
              numeroProducao: 7463,
              numeroBatelada: 1,
              dataInicialProducao: "17/09/2026 08:54:59",
              dataFinalProducao: "17/09/2026 08:59:14",
              dataInicialBatelada: "17/09/2026 08:54:59",
              dataFinalBatelada: "17/09/2026 08:59:14",
              codProdMP: 47,
              pesoSolicitado: "204",
              pesoDosado: "204,5",
              numeroLoteMP: "0",
              numeroLotePA: "PR17092026-0002"
            },
            {
              numeroProducao: 7463,
              numeroBatelada: 1,
              dataInicialProducao: "17/09/2026 08:54:59",
              dataFinalProducao: "17/09/2026 08:59:14",
              dataInicialBatelada: "17/09/2026 08:54:59",
              dataFinalBatelada: "17/09/2026 08:59:14",
              codProdMP: 17,
              pesoSolicitado: "306",
              pesoDosado: "307",
              numeroLoteMP: "0",
              numeroLotePA: "PR17092026-0002"
            }
          ]
        ]
      };
    }
    const items = data.result && data.result[0] ? data.result[0] : [];
    const summaryMap = /* @__PURE__ */ new Map();
    items.forEach((item) => {
      const codMp = item.codProdMP;
      if (!summaryMap.has(codMp)) {
        summaryMap.set(codMp, {
          codProdMP: codMp,
          pesoSolicitado: 0,
          pesoDosado: 0
        });
      }
      const st = summaryMap.get(codMp);
      st.pesoSolicitado += parseFloat((item.pesoSolicitado || "0").toString().replace(",", "."));
      st.pesoDosado += parseFloat((item.pesoDosado || "0").toString().replace(",", "."));
    });
    let hanaItems = {};
    if (!sapConfig.isSandbox && isSandbox !== "true") {
      try {
        const [host, portStr] = sapConfig.hanaServer.split(":");
        const port = parseInt(portStr || "30015");
        const client = import_hdb.default.createClient({ host, port, user: sapConfig.hanaUser, password: sapConfig.hanaPassword });
        await new Promise((resolve) => {
          client.connect((err) => {
            if (err) return resolve();
            const query = `SELECT A."ItemCode", A."ItemName", A."U_SigaFran" FROM "GRANUSA_PROD"."OITM" A WHERE A."U_SigaFran" IS NOT NULL`;
            client.exec(query, (execErr, rows) => {
              client.end();
              if (!execErr) {
                (rows || []).forEach((r) => {
                  const codSiga = (r.U_SigaFran || r.U_SIGAFRAN || r.u_sigafran || "").toString();
                  hanaItems[codSiga] = { ItemCode: r.ItemCode || r.ITEMCODE, ItemName: r.ItemName || r.ITEMNAME };
                });
              }
              resolve();
            });
          });
        });
      } catch (hanaError) {
        addLog("WARN", `Error consultando OITM en HANA: ${hanaError.message}`);
      }
    }
    const mapSapItem = (codMp) => {
      const key = codMp.toString();
      if (hanaItems[key]) return hanaItems[key];
      return { ItemCode: `SAP-MAT-${key}`, ItemName: `Material SAP Simulado ${key}` };
    };
    const summary = Array.from(summaryMap.values()).map((s) => ({
      ...s,
      ...mapSapItem(s.codProdMP)
    }));
    const detailed = items.map((item) => ({
      ...item,
      ...mapSapItem(item.codProdMP)
    }));
    addLog("SUCCESS", `Telemetr\xEDa recibida del WS. ${detailed.length} registros obtenidos.`);
    res.json({ success: true, summary, detailed });
  } catch (error) {
    addLog("ERROR", `Error obteniendo datos WS: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/sap/batches", async (req, res) => {
  const { schema, itemCode, warehouse } = req.query;
  try {
    addLog("INFO", `Consultando lotes para el art\xEDculo ${itemCode} en almac\xE9n ${warehouse} (Esquema: ${schema})...`);
    if (sapConfig.isSandbox) {
      return res.json([
        { SysNumber: 1, DistNumber: "LOTE-SIM-01", Quantity: 100 },
        { SysNumber: 2, DistNumber: "LOTE-SIM-02", Quantity: 250 }
      ]);
    }
    const [host, portStr] = sapConfig.hanaServer.split(":");
    const port = parseInt(portStr || "30015");
    const client = import_hdb.default.createClient({ host, port, user: sapConfig.hanaUser, password: sapConfig.hanaPassword });
    await new Promise((resolve, reject) => {
      client.connect((err) => {
        if (err) return reject(err);
        const query = `
             SELECT  T0."ItemCode", T1."ItemName", T2."SysNumber", T2."DistNumber", T0."Quantity"
             FROM "${schema}"."OBTQ" T0 
             INNER JOIN "${schema}"."OITM" T1 ON T0."ItemCode" = T1."ItemCode" 
             INNER JOIN "${schema}"."OBTN" T2 ON T0."MdAbsEntry" = T2."AbsEntry"
             WHERE T1."ManBtchNum" = 'Y' AND T1."ManSerNum" = 'N' AND T0."Quantity" > 0 
               AND T0."ItemCode" = '${itemCode}' AND T0."WhsCode" = '${warehouse}'
             ORDER BY T2."SysNumber" asc
           `;
        client.exec(query, (execErr, rows) => {
          client.end();
          if (execErr) return reject(execErr);
          const batches = (rows || []).map((r) => ({
            ItemCode: r.ItemCode || r.ITEMCODE,
            ItemName: r.ItemName || r.ITEMNAME,
            SysNumber: r.SysNumber || r.SYSNUMBER,
            DistNumber: r.DistNumber || r.DISTNUMBER,
            Quantity: r.Quantity || r.QUANTITY
          }));
          res.json(batches);
          resolve();
        });
      });
    });
    addLog("SUCCESS", `Lotes consultados para ${itemCode}.`);
  } catch (error) {
    addLog("ERROR", `Error consultando lotes: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/sap/inventory-gen-exits", async (req, res) => {
  try {
    const payload = req.body;
    addLog("INFO", `Iniciando Salida de Mercanc\xEDas (InventoryGenExits)...`);
    console.log("=== PAYLOAD INVENTORY GEN EXITS ===");
    console.log(JSON.stringify(payload, null, 2));
    console.log("===================================");
    if (sapConfig.isSandbox) {
      addLog("SUCCESS", `Simulaci\xF3n de Salida exitosa.`);
      return res.json({ success: true, docNum: "SIM-EXIT-1234" });
    }
    const sessionId = req.headers["x-sap-session-id"] || sapConfig.sessionId;
    const response = await fetch("https://172.19.0.88:50000/b1s/v1/InventoryGenExits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `B1SESSION=${sessionId}; ROUTEID=.node2`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`SL Error ${response.status}: ${errorData}`);
    }
    const data = await response.json();
    addLog("SUCCESS", `Salida de mercanc\xEDas generada en SAP: ${data.DocNum}`);
    res.json({ success: true, data });
  } catch (error) {
    addLog("ERROR", `Error en Salida de Mercanc\xEDas: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/sap/inventory-gen-entries", async (req, res) => {
  try {
    const payload = req.body;
    addLog("INFO", `Iniciando Entrada de Mercanc\xEDas (InventoryGenEntries)...`);
    if (sapConfig.isSandbox) {
      addLog("SUCCESS", `Simulaci\xF3n de Entrada exitosa.`);
      return res.json({ success: true, docNum: "SIM-ENTRY-1234" });
    }
    const sessionId = req.headers["x-sap-session-id"] || sapConfig.sessionId;
    const response = await fetch("https://172.19.0.88:50000/b1s/v1/InventoryGenEntries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `B1SESSION=${sessionId}; ROUTEID=.node2`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`SL Error ${response.status}: ${errorData}`);
    }
    const data = await response.json();
    addLog("SUCCESS", `Entrada de mercanc\xEDas generada en SAP: ${data.DocNum}`);
    res.json({ success: true, data });
  } catch (error) {
    addLog("ERROR", `Error en Entrada de Mercanc\xEDas: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.patch("/api/sap/production-orders/:docEntry/close", async (req, res) => {
  try {
    const { docEntry } = req.params;
    addLog("INFO", `Cerrando Orden de Producci\xF3n ${docEntry}...`);
    if (sapConfig.isSandbox) {
      addLog("SUCCESS", `Simulaci\xF3n de cierre exitosa para la orden ${docEntry}.`);
      return res.json({ success: true });
    }
    const sessionId = req.headers["x-sap-session-id"] || sapConfig.sessionId;
    const response = await fetch(`https://172.19.0.88:50000/b1s/v1/ProductionOrders(${docEntry})`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `B1SESSION=${sessionId}; ROUTEID=.node2`
      },
      body: JSON.stringify({ ProductionOrderStatus: "boposClosed" })
    });
    if (!response.ok) {
      if (response.status !== 204) {
        const errorData = await response.text();
        throw new Error(`SL Error ${response.status}: ${errorData}`);
      }
    }
    addLog("SUCCESS", `Orden de Producci\xF3n ${docEntry} cerrada en SAP.`);
    res.json({ success: true });
  } catch (error) {
    addLog("ERROR", `Error cerrando OP: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  addLog("SUCCESS", `TandemPRO Backend API corriendo exitosamente en el puerto ${PORT}`);
  console.log(`API Backend escuchando en: http://localhost:${PORT}`);
});
//# sourceMappingURL=index.cjs.map
