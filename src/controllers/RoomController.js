const Database = require("../db/config");

module.exports = {
  async create(request, response) {
    const db = await Database();
    const password = request.body.password;
    let roomId;
    let isRoom = true;
    while (isRoom) {
      for (var i = 0; i < 6; i++) {
        i == 0
          ? (roomId = Math.floor(Math.random() * 10).toString())
          : (roomId += Math.floor(Math.random() * 10).toString());
      }

      const roomsExistIds = await db.all(`SELECT id FROM rooms`);
      isRoom = roomsExistIds.some((roomsExistId) => roomsExistId === roomId);

      if (!isRoom) {
        await db.run(`INSERT INTO rooms (
          id,
          password
      ) VALUES (
          ${parseInt(roomId)},
          ${password}
        )`);
      }
    }

    await db.close();

    response.redirect(`/room/${roomId}`);
  },

  async open(request, response) {
    const db = await Database();
    const roomId = request.params.room;
    const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`);
    const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`);
    let isQuestions = true

    if(questions.length == 0) {
      if(questionsRead.length == 0) {
        isQuestions = false
      }
    }

    response.render("room", {
      roomId: roomId,
      questions: questions,
      questionsRead: questionsRead,
      isQuestions: isQuestions
    });
  },

  enter(request, response) {
    const roomId = request.body.roomId;

    response.redirect(`/room/${roomId}`);
  },
};
