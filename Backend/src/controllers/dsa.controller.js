const DSAService = require('../services/dsa.service');

class DSAController {
  /**
   * Get DSA content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getDSAContent(req, res) {
    try {
      const dsaContent = await DSAService.getDSAContent();
      return res.status(200).json(dsaContent);
    } catch (error) {
      console.error('Error fetching DSA content:', error);
      return res.status(500).json({ error: 'Failed to fetch DSA content' });
    }
  }

  /**
   * Run visualized code
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async runVisualizedCode(req, res) {
    try {
      const { userCode, languageId, problemId } = req.body;

      if (!userCode || !languageId || !problemId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: userCode, languageId, or problemId' 
        });
      }

      const result = await DSAService.runVisualizedCode(userCode, languageId, problemId);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error running visualized code:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to run visualized code', 
        details: error.message 
      });
    }
  }
}

module.exports = DSAController;