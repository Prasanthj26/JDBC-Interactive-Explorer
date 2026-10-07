const initialStudents = [
  { id: 1, name: "Arun", course: "Java" },
  { id: 2, name: "Priya", course: "JDBC" },
  { id: 3, name: "Ravi", course: "MySQL" }
];

const componentText = {
  java: {
    beginner: "Java Application is where your JDBC code starts.",
    technical: "The Java Application calls JDBC interfaces to request a database session."
  },
  api: {
    beginner: "JDBC API gives Java a common way to talk to databases.",
    technical: "JDBC API defines interfaces such as Connection, Statement, PreparedStatement, and ResultSet."
  },
  manager: {
    beginner: "DriverManager helps Java find the right database driver.",
    technical: "DriverManager selects a registered driver that accepts the JDBC URL."
  },
  driver: {
    beginner: "Driver = bridge between Java and MySQL.",
    technical: "The JDBC driver translates JDBC calls into the database protocol used by MySQL."
  },
  connection: {
    beginner: "Connection is the live link between Java and the database.",
    technical: "Connection represents an authenticated session and transaction context with the database."
  },
  statement: {
    beginner: "Statement sends SQL commands from Java.",
    technical: "Statement and PreparedStatement execute SQL through an active Connection."
  },
  query: {
    beginner: "SQL Query asks the database to read or change data.",
    technical: "SQL is sent through JDBC and executed by the database engine."
  },
  database: {
    beginner: "MySQL Database stores tables and records.",
    technical: "The database engine parses SQL, reads or mutates tables, and returns results or affected row counts."
  },
  resultset: {
    beginner: "ResultSet carries selected rows back to Java.",
    technical: "ResultSet exposes a cursor over rows returned by a SELECT query."
  }
};

const progressLabels = ["Java", "DriverManager", "Driver", "Connection", "Statement", "Query", "Database", "ResultSet", "Close"];
const challengeOrder = ["Java Application", "JDBC API", "DriverManager", "JDBC Driver", "Connection", "PreparedStatement", "Database", "ResultSet"];

const state = {
  started: false,
  step: 0,
  beginner: true,
  students: structuredClone(initialStudents),
  selectedId: 2,
  resultIndex: 0,
  rsCursor: -1,
  challengeIndex: 0,
  challengeScore: 0,
  dmlMode: "INSERT"
};

const els = {
  welcome: document.getElementById("welcomeScreen"),
  explorer: document.getElementById("explorer"),
  startBtn: document.getElementById("startBtn"),
  restartBtn: document.getElementById("restartBtn"),
  beginnerMode: document.getElementById("beginnerMode"),
  progressList: document.getElementById("progressList"),
  stepKicker: document.getElementById("stepKicker"),
  stepTitle: document.getElementById("stepTitle"),
  stepContent: document.getElementById("stepContent"),
  prevStepBtn: document.getElementById("prevStepBtn"),
  nextStepBtn: document.getElementById("nextStepBtn"),
  packet: document.getElementById("packet"),
  componentInfo: document.getElementById("componentInfo"),
  flowNodes: [...document.querySelectorAll(".flow-node")],
  challengeBlocks: document.getElementById("challengeBlocks"),
  challengeFeedback: document.getElementById("challengeFeedback"),
  challengeScore: document.getElementById("challengeScore"),
  resetChallengeBtn: document.getElementById("resetChallengeBtn"),
  sqlType: document.getElementById("sqlType"),
  sqlEditor: document.getElementById("sqlEditor"),
  runSqlBtn: document.getElementById("runSqlBtn"),
  playgroundOutput: document.getElementById("playgroundOutput")
};

function modeText(entry) {
  return state.beginner ? entry.beginner : entry.technical;
}

function setInfo(message) {
  els.componentInfo.textContent = message;
}

function animatePacket() {
  els.packet.classList.remove("run");
  void els.packet.offsetWidth;
  els.packet.classList.add("run");
}

function setActiveComponents(keys) {
  els.flowNodes.forEach((node) => {
    node.classList.toggle("active", keys.includes(node.dataset.component));
  });
}

function studentTable(rows = state.students, highlightId = null) {
  const body = rows.map((row) => `
    <tr class="${row.id === highlightId ? "highlight" : ""}">
      <td>${row.id}</td><td>${row.name}</td><td>${row.course}</td>
    </tr>
  `).join("");
  return `
    <div class="db-card">
      <p class="db-title">DATABASE demo → TABLE students</p>
      <table aria-label="Students table">
        <thead><tr><th>id</th><th>name</th><th>course</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function codeBlock(html) {
  return `<pre class="code-panel"><code>${html}</code></pre>`;
}

function explanation(id) {
  return `<div id="${id}" class="terminal" aria-live="polite">Click the highlighted code or control to inspect it.</div>`;
}

function stepJava() {
  return `
    ${codeBlock(`<button class="token-button" data-explain="Connection represents the communication link between your Java application and the database.">Connection</button> con =
    <button class="token-button" data-explain="DriverManager asks registered drivers who can handle this JDBC URL.">DriverManager</button>.getConnection(
        <button class="token-button" data-explain="The URL tells JDBC which database type, host, port, and database name to use.">"jdbc:mysql://localhost:3306/demo"</button>,
        "root",
        "password"
    );`)}
    ${explanation("codeExplain")}
  `;
}

function stepManager() {
  return `
    <div class="concept-grid">
      <button class="concept-card flow-click" data-component="java" type="button"><strong>Java Application</strong><span>Starts the request</span></button>
      <button class="concept-card flow-click" data-component="manager" type="button"><strong>DriverManager</strong><span>Finds a matching driver</span></button>
      <button class="concept-card flow-click" data-component="driver" type="button"><strong>JDBC Driver</strong><span>Receives the handoff</span></button>
    </div>
    <button class="primary-action" data-action="sendToManager" type="button">Send Connection Request</button>
    <div class="terminal">DriverManager helps Java find and use the appropriate JDBC driver.</div>
  `;
}

function stepDriver() {
  return `
    <div class="concept-grid">
      <div class="concept-card"><strong>Java understands JDBC</strong><span>Common interfaces</span></div>
      <button class="concept-card flow-click" data-component="driver" type="button"><strong>MySQL JDBC Driver</strong><span>Click to activate bridge</span></button>
      <div class="concept-card"><strong>MySQL understands database communication</strong><span>Native protocol</span></div>
    </div>
    <div id="driverOutput" class="terminal">The JDBC driver acts like a bridge between Java and the database.</div>
  `;
}

function stepConnection() {
  return `
    <p class="status-ok">Connection Established ✓</p>
    <div class="db-grid">
      ${studentTable()}
    </div>
    <button class="primary-action" data-action="connectDb" type="button">Animate Java ↔ MySQL Connection</button>
    <div class="terminal">The connection line is now open between the Java application and MySQL.</div>
  `;
}

function stepStatement() {
  return `
    ${codeBlock(`Statement stmt =
    con.<button class="token-button" data-explain="Statement is used to send SQL commands from Java to the database.">createStatement()</button>;`)}
    ${explanation("codeExplain")}
    <button class="primary-action" data-action="statementFlow" type="button">Create Statement</button>
  `;
}

function stepPreparedStatement() {
  return `
    ${codeBlock(`PreparedStatement ps =
    con.prepareStatement(
        "SELECT * FROM students WHERE id = <button class="token-button" data-explain="The question mark is a placeholder. Java sets its value safely before execution.">?</button>"
    );`)}
    <div class="input-row">
      <button class="mini-action" data-action="showIdInput" type="button">Set ID</button>
      <label for="studentIdInput">Student ID</label>
      <input id="studentIdInput" type="number" min="1" value="${state.selectedId}">
      <button class="primary-action" data-action="setPreparedValue" type="button">Set Value</button>
    </div>
    <div id="preparedSql" class="terminal">SELECT * FROM students WHERE id = ?</div>
  `;
}

function stepExecuteQuery() {
  return `
    ${codeBlock(`ResultSet rs =
    ps.executeQuery();`)}
    <button class="primary-action" data-action="executeQuery" type="button">Execute Query</button>
    <div id="queryOutput" class="terminal">Ready to send SQL through JDBC.</div>
  `;
}

function stepResultSet() {
  const rows = state.students.filter((student) => student.id === Number(state.selectedId));
  const visibleRows = rows.length ? rows : state.students;
  const active = visibleRows[state.resultIndex % visibleRows.length];
  return `
    <p>RESULT SET</p>
    ${studentTable([active], active.id)}
    <button class="primary-action" data-action="nextResultRecord" type="button">Next Record</button>
    <div class="terminal">ResultSet contains the data returned by a SELECT query.</div>
  `;
}

function stepResultSetNext() {
  return `
    ${codeBlock(`while(rs.<button class="token-button" data-explain="rs.next() moves the cursor to the next row. It returns false after the last row.">next()</button>) {

    System.out.println(
        rs.getString("name")
    );

}`)}
    ${studentTable(state.students, state.students[state.rsCursor]?.id)}
    <button class="primary-action" data-action="nextRow" type="button">Next Row</button>
    <div id="cursorOutput" class="terminal">Cursor is before the first row. Click Next Row.</div>
  `;
}

function stepDml() {
  return `
    <div class="operation-tabs" role="group" aria-label="Choose update operation">
      ${["INSERT", "UPDATE", "DELETE"].map((mode) => `<button class="mini-action" data-dml="${mode}" aria-pressed="${state.dmlMode === mode}" type="button">${mode}</button>`).join("")}
    </div>
    <pre id="dmlSql" class="code-panel"><code>${dmlSql()}</code></pre>
    ${studentTable()}
    <button class="primary-action" data-action="executeDml" type="button">Execute</button>
    <div id="dmlOutput" class="terminal">executeUpdate() is commonly used for INSERT, UPDATE and DELETE operations.</div>
  `;
}

function stepClose() {
  return `
    ${codeBlock(`rs.close();
ps.close();
con.close();`)}
    <button class="primary-action" data-action="closeResources" type="button">Close Resources</button>
    <div id="closeOutput" class="resource-grid">
      <div class="resource-item"><strong>ResultSet</strong><span>Open</span></div>
      <div class="resource-item"><strong>PreparedStatement</strong><span>Open</span></div>
      <div class="resource-item"><strong>Connection</strong><span>Open</span></div>
    </div>
    <div class="terminal">JDBC resources should be closed after use.</div>
  `;
}

function stepFinal() {
  return `
    <div class="terminal">Complete JDBC flow unlocked. Click any component in the visual map to review its purpose.</div>
    <button class="primary-action" data-action="finalFlow" type="button">Play Complete Flow</button>
    <div class="concept-grid">
      ${Object.entries(componentText).map(([key, text]) => `<button class="concept-card flow-click" data-component="${key}" type="button"><strong>${key}</strong><span>${modeText(text)}</span></button>`).join("")}
    </div>
  `;
}

const steps = [
  { title: "Java Application", components: ["java", "api"], render: stepJava },
  { title: "DriverManager", components: ["java", "manager", "driver"], render: stepManager },
  { title: "JDBC Driver", components: ["api", "driver", "database"], render: stepDriver },
  { title: "Database Connection", components: ["java", "connection", "database"], render: stepConnection },
  { title: "Create Statement", components: ["statement", "query"], render: stepStatement },
  { title: "Prepared Statement", components: ["statement", "query"], render: stepPreparedStatement },
  { title: "Execute Query", components: ["query", "database"], render: stepExecuteQuery },
  { title: "ResultSet", components: ["database", "resultset", "java"], render: stepResultSet },
  { title: "ResultSet next()", components: ["resultset", "java"], render: stepResultSetNext },
  { title: "Insert / Update / Delete", components: ["statement", "database"], render: stepDml },
  { title: "Close Resources", components: ["resultset", "statement", "connection"], render: stepClose },
  { title: "Final JDBC Flow", components: ["java", "api", "manager", "driver", "connection", "statement", "query", "database", "resultset"], render: stepFinal }
];

function dmlSql() {
  if (state.dmlMode === "INSERT") return "INSERT INTO students\nVALUES (4, 'Kumar', 'Java');";
  if (state.dmlMode === "UPDATE") return "UPDATE students\nSET course = 'Advanced JDBC'\nWHERE id = 2;";
  return "DELETE FROM students\nWHERE id = 3;";
}

function renderProgress() {
  els.progressList.innerHTML = progressLabels.map((label, index) => {
    const currentProgress = Math.min(state.step, progressLabels.length - 1);
    const className = index < currentProgress ? "done" : index === currentProgress ? "active" : "";
    const prefix = index < currentProgress ? "✓ " : `${index + 1} `;
    return `<li class="${className}">${prefix}${label}</li>`;
  }).join("");
}

function renderStep() {
  const step = steps[state.step];
  els.stepKicker.textContent = `Step ${Math.min(state.step + 1, steps.length)}`;
  els.stepTitle.textContent = step.title;
  els.stepContent.innerHTML = step.render();
  els.prevStepBtn.disabled = state.step === 0;
  els.nextStepBtn.textContent = state.step === steps.length - 1 ? "Finish" : "Next";
  setActiveComponents(step.components);
  renderProgress();
}

function startJourney() {
  state.started = true;
  els.welcome.classList.add("hidden");
  els.explorer.classList.remove("hidden");
  renderStep();
  resetChallenge();
}

function resetAll() {
  state.step = 0;
  state.students = structuredClone(initialStudents);
  state.selectedId = 2;
  state.resultIndex = 0;
  state.rsCursor = -1;
  state.dmlMode = "INSERT";
  els.sqlType.value = "SELECT";
  setSqlTemplate();
  els.playgroundOutput.textContent = "Choose an operation and run a simulated query.";
  resetChallenge();
  setInfo("Click a component to learn its job in the JDBC flow.");
  renderStep();
}

function handleStepClick(event) {
  const explainTarget = event.target.closest("[data-explain]");
  if (explainTarget) {
    const box = document.getElementById("codeExplain");
    if (box) box.textContent = explainTarget.dataset.explain;
  }

  const componentTarget = event.target.closest("[data-component]");
  if (componentTarget) {
    const key = componentTarget.dataset.component;
    setInfo(modeText(componentText[key]));
    document.querySelector(`.flow-node[data-component="${key}"]`)?.classList.add("clicked");
  }

  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) runAction(actionTarget.dataset.action);

  const dmlTarget = event.target.closest("[data-dml]");
  if (dmlTarget) {
    state.dmlMode = dmlTarget.dataset.dml;
    renderStep();
  }
}

function runAction(action) {
  if (action === "sendToManager") {
    setActiveComponents(["java", "manager", "driver"]);
    animatePacket();
    setInfo("DriverManager helps Java obtain the appropriate database driver.");
  }
  if (action === "connectDb") {
    setActiveComponents(["java", "connection", "database"]);
    animatePacket();
  }
  if (action === "statementFlow") {
    setActiveComponents(["java", "statement", "database"]);
    animatePacket();
    setInfo("Statement is ready to carry SQL commands.");
  }
  if (action === "showIdInput") {
    document.getElementById("studentIdInput")?.focus();
  }
  if (action === "setPreparedValue") {
    const input = document.getElementById("studentIdInput");
    state.selectedId = Number(input.value || 2);
    document.getElementById("preparedSql").textContent = `SELECT * FROM students WHERE id = ${state.selectedId}`;
    animatePacket();
  }
  if (action === "executeQuery") {
    animatePacket();
    document.getElementById("queryOutput").textContent = "Java → PreparedStatement → SQL Query → MySQL → ResultSet";
  }
  if (action === "nextResultRecord") {
    state.resultIndex += 1;
    animatePacket();
    renderStep();
  }
  if (action === "nextRow") {
    state.rsCursor = (state.rsCursor + 1) % state.students.length;
    renderStep();
    const row = state.students[state.rsCursor];
    document.getElementById("cursorOutput").textContent = `rs.next() moved to row ${state.rsCursor + 1}: ${row.name}`;
  }
  if (action === "executeDml") {
    executeDml();
  }
  if (action === "closeResources") {
    animatePacket();
    document.getElementById("closeOutput").innerHTML = `
      <div class="resource-item"><strong>ResultSet</strong><span class="status-ok">✓ Closed</span></div>
      <div class="resource-item"><strong>PreparedStatement</strong><span class="status-ok">✓ Closed</span></div>
      <div class="resource-item"><strong>Connection</strong><span class="status-ok">✓ Closed</span></div>
    `;
  }
  if (action === "finalFlow") {
    setActiveComponents(["java", "api", "manager", "driver", "connection", "statement", "query", "database", "resultset"]);
    animatePacket();
  }
}

function executeDml() {
  let message = "1 row affected ✓";
  if (state.dmlMode === "INSERT") {
    if (!state.students.some((student) => student.id === 4)) {
      state.students.push({ id: 4, name: "Kumar", course: "Java" });
    } else {
      message = "Row already exists in this simulation.";
    }
  }
  if (state.dmlMode === "UPDATE") {
    const student = state.students.find((row) => row.id === 2);
    if (student) student.course = "Advanced JDBC";
  }
  if (state.dmlMode === "DELETE") {
    state.students = state.students.filter((row) => row.id !== 3);
  }
  animatePacket();
  renderStep();
  const dmlOutput = document.getElementById("dmlOutput");
  if (dmlOutput) dmlOutput.textContent = message;
}

function resetChallenge() {
  state.challengeIndex = 0;
  state.challengeScore = 0;
  const shuffled = [...challengeOrder].sort(() => Math.random() - 0.5);
  els.challengeBlocks.innerHTML = shuffled.map((label) => `<button class="challenge-block" data-challenge="${label}" type="button">${label}</button>`).join("");
  els.challengeFeedback.textContent = "Start with the Java Application.";
  updateChallengeScore();
}

function updateChallengeScore() {
  els.challengeScore.textContent = `Score: ${state.challengeScore} / 10`;
}

function handleChallengeClick(event) {
  const button = event.target.closest("[data-challenge]");
  if (!button || button.disabled) return;
  const expected = challengeOrder[state.challengeIndex];
  if (button.dataset.challenge === expected) {
    button.classList.add("correct");
    button.disabled = true;
    state.challengeIndex += 1;
    state.challengeScore = Math.min(10, state.challengeScore + (state.challengeIndex === challengeOrder.length ? 3 : 1));
    els.challengeFeedback.textContent = state.challengeIndex === challengeOrder.length
      ? "JDBC FLOW COMPLETE!"
      : `✓ Correct! Next: ${challengeOrder[state.challengeIndex]}`;
  } else {
    button.classList.add("wrong");
    setTimeout(() => button.classList.remove("wrong"), 650);
    els.challengeFeedback.textContent = "Not quite. Think about what Java needs before it can communicate with MySQL.";
  }
  updateChallengeScore();
}

function setSqlTemplate() {
  const type = els.sqlType.value;
  const templates = {
    SELECT: "SELECT * FROM students;",
    INSERT: "INSERT INTO students VALUES (4, 'Kumar', 'Java');",
    UPDATE: "UPDATE students SET course = 'Advanced JDBC' WHERE id = 2;",
    DELETE: "DELETE FROM students WHERE id = 3;"
  };
  els.sqlEditor.value = templates[type];
}

function runPlaygroundQuery() {
  const type = els.sqlType.value;
  if (type === "SELECT") {
    els.playgroundOutput.innerHTML = `Java → JDBC → Driver → Database → Result<br>${state.students.map((s) => `${s.id} | ${s.name} | ${s.course}`).join("<br>")}`;
  } else {
    state.dmlMode = type;
    executeDml();
    els.playgroundOutput.textContent = `Java → JDBC → Driver → Database → ${type} simulated. 1 row affected ✓`;
  }
  animatePacket();
}

function bindEvents() {
  els.startBtn.addEventListener("click", startJourney);
  els.restartBtn.addEventListener("click", resetAll);
  els.beginnerMode.addEventListener("change", () => {
    state.beginner = els.beginnerMode.checked;
    renderStep();
  });
  els.prevStepBtn.addEventListener("click", () => {
    state.step = Math.max(0, state.step - 1);
    renderStep();
  });
  els.nextStepBtn.addEventListener("click", () => {
    state.step = state.step === steps.length - 1 ? 0 : state.step + 1;
    renderStep();
  });
  els.stepContent.addEventListener("click", handleStepClick);
  els.flowNodes.forEach((node) => {
    node.addEventListener("click", () => {
      setInfo(modeText(componentText[node.dataset.component]));
      node.classList.add("clicked");
    });
  });
  els.challengeBlocks.addEventListener("click", handleChallengeClick);
  els.resetChallengeBtn.addEventListener("click", resetChallenge);
  els.sqlType.addEventListener("change", setSqlTemplate);
  els.runSqlBtn.addEventListener("click", runPlaygroundQuery);
}

bindEvents();
setSqlTemplate();
