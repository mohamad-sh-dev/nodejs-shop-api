const BaseController = require('../baseController');

class ApiController extends BaseController {
  home(req, res) {
    return res.status(200).json({
        status: 'success',
        message: 'hi from index page'
    });
  }
}

module.exports = new ApiController();
