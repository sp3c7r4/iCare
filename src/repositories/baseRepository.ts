import CustomError from "../utils/error";
import errorHelper from "../utils/errorHelper";
import HttpStatus from "../utils/http";
import logTracker from "../utils/logTracker";

class baseRepository {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  validateDataCheck(data: object) {
    if( !data || Object.keys(data).length === 0 ) {
      throw new CustomError("No data provided!!!", HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status)
    }
  }

  async create(data: object): Promise<object> {
    this.validateDataCheck(data);
    try {
      return await this.model.create(data);
    } catch (err) {
      logTracker.log( 'info', JSON.stringify(errorHelper.returnErrorLog(err)) );
      throw new CustomError(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status
      );
    }
  } 
  
  async readOneById(id: string) {
    try {
      const findOne = await this.model.findOne({
        where: {
          id: id,
        },
      });
      return findOne;
    } catch (err) {
      logTracker.log(
        'error',
        JSON.stringify(errorHelper.returnErrorLog(err))
      );
      throw new CustomError(
        "Failed to fetch the record. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status
      );
    }
  }

  async readByEmail(email: string): Promise<object> {
    try {
      const findOne = this.model.findOne({
        where: {
          email: email,
        },
      });
      return findOne;
    } catch (err) {
      logTracker.log( 'info', JSON.stringify(errorHelper.returnErrorLog(err)) );
      throw new CustomError(
        'Failed to read the record by Mail. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status
      );
    }
  } 

  async readAll() {
    try {
      return await this.model.findAll();
    } catch (err) {
      logTracker.log(
        'error',
        JSON.stringify(errorHelper.returnErrorLog(err))
      );
      throw new CustomError(
        "Failed to fetch all records. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status
      );
    }
  }

  async updateModel(id: string, data: object) {
    //Handle no data
    this.validateDataCheck(data);
    try {
      const model = await this.readOneById(id);
      await model.update(data);
      return model;
    } catch (err) {
      logTracker.log(
        'error',
        JSON.stringify(errorHelper.returnErrorLog(err))
      );
      throw new CustomError(
        'Failed to update the record. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status
      );
    }
  }

  async deleteModel(id: string) {
    try {
      await this.model.destroy({
        where: {
          id: id,
        },
      });
      return 'Success';
    } catch (err) {
      logTracker.log(
        'error',
        JSON.stringify(errorHelper.returnErrorLog(err))
      );
      throw new CustomError(
        'Could not delete model',
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status
      );
    }
  }
}

export default baseRepository;