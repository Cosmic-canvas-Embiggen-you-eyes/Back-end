import db from "./db.js";
class labelModel {
  constructor(db) {
    this.db = db; // Use the pool instance from `pg`
  }
  async AddLabel(name, x_axis, y_axis, user_id, imageName, visibility) {
    const query = `
      INSERT INTO labels (name, x_axis, y_axis, user_id, imageName, visibility)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [name, x_axis, y_axis, user_id, imageName, visibility];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
    async GetLabelsByImageName(imageName) {
    const query = `
        SELECT * FROM labels WHERE imageName = $1;
    `;
    const values = [imageName];
    const result = await this.db.query(query, values);
    return result.rows;
  }
    async DeleteLabel(label_id, user_id) {
    const query = `
      DELETE FROM labels WHERE id = $1 AND user_id = $2 RETURNING *;
    `;
    const values = [label_id, user_id];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
  async UpdateLabel(label_id, user_id, name, x_axis, y_axis) {
    const query = `
        UPDATE labels 
        SET name = $3, x_axis = $4, y_axis = $5
        WHERE id = $1 AND user_id = $2
        RETURNING *;
    `;
    const values = [label_id, user_id, name, x_axis, y_axis];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
  async GetLabelById(label_id) {
    const query = `
        SELECT * FROM labels WHERE id = $1;
    `;
    const values = [label_id];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
  async GetAllLabels() {
    const query = `
        SELECT * FROM labels;
    `;
    const result = await this.db.query(query);
    return result.rows;
  }
  async GetLabelsByUserId(user_id) {
    const query = `
        SELECT * FROM labels WHERE user_id = $1;
    `;
    const values = [user_id];
    const result = await this.db.query(query, values);
    return result.rows;
  }
}
export default new labelModel(db);