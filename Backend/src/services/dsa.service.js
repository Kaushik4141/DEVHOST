const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

class DSAService {
  /**
   * Get DSA content from JSON file
   * @returns {Promise<Object>} DSA content
   */
  static async getDSAContent() {
    try {
      const filePath = path.join(__dirname, '../data/dsa_content.json');
      const data = await readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading DSA content file:', error);
      throw new Error('Failed to read DSA content');
    }
  }

  /**
   * Instrument code with visualization logging
   * @param {string} userCode - User submitted code
   * @param {string} problemId - Problem identifier
   * @returns {string} Instrumented code
   */
  static instrumentCode(userCode, problemId) {
    // Different instrumentation based on problem type
    switch (problemId) {
      case 'linked-list-pointers':
        return this._instrumentLinkedListCode(userCode);
      case 'binary-search':
        return this._instrumentBinarySearchCode(userCode);
      case 'n-queens':
        return this._instrumentNQueensCode(userCode);
      case 'dynamic-programming':
        return this._instrumentDPCode(userCode);
      case 'backtracking':
        return this._instrumentBacktrackingCode(userCode);
      case 'graph-algorithms':
        return this._instrumentGraphCode(userCode);
      default:
        // Basic instrumentation for unknown problem types
        return this._instrumentGenericCode(userCode);
    }
  }

  /**
   * Instrument linked list code
   * @param {string} code - Original code
   * @returns {string} Instrumented code
   */
  static _instrumentLinkedListCode(code) {
    // Find pointer reassignment in the code and add logging
    // This is a simplified example - real implementation would be more robust
    const instrumentedCode = code.replace(
      /([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_]+)(?:\.next)?/g,
      (match, left, right) => {
        return `${match}; console.log(\`TRACE: ${JSON.stringify({ event: 'step', prev: prev?.val ?? null, curr: current?.val ?? null })}\`);`;
      }
    );
    
    return instrumentedCode;
  }

  /**
   * Instrument binary search code
   * @param {string} code - Original code
   * @returns {string} Instrumented code
   */
  static _instrumentBinarySearchCode(code) {
    // Find binary search loop and add logging for mid, left, right
    const instrumentedCode = code.replace(
      /(let|var|const)\s+(mid|middle)\s*=\s*Math\.floor\(\s*\(\s*(left|low|start)\s*\+\s*(right|high|end)\s*\)\s*\/\s*2\s*\)/g,
      (match, keyword, mid, left, right) => {
        return `${match}; console.log('TRACE: ' + JSON.stringify({ event: 'step', left: ${left}, right: ${right}, mid: ${mid}, value: arr[${mid}] }));`;
      }
    );
    
    return instrumentedCode;
  }

  /**
   * Instrument N-Queens code
   * @param {string} code - Original code
   * @returns {string} Instrumented code
   */
  static _instrumentNQueensCode(code) {
    // Add logging for board state after queen placement
    const placeQueenRegex = /board\[([^\]]+)\]\[([^\]]+)\]\s*=\s*1/g;
    const instrumentedCode = code.replace(
      placeQueenRegex,
      (match, row, col) => {
        return `${match}; console.log('TRACE: ' + JSON.stringify({ event: 'place', row: ${row}, col: ${col}, board: JSON.stringify(board) }));`;
      }
    );
    
    return instrumentedCode;
  }

  /**
   * Instrument dynamic programming code
   * @param {string} code - Original code
   * @returns {string} Instrumented code
   */
  static _instrumentDPCode(code) {
    // Add logging for DP table updates
    const dpUpdateRegex = /(dp\[([^\]]+)\](?:\[([^\]]+)\])?)\s*=\s*([^;]+)/g;
    const instrumentedCode = code.replace(
      dpUpdateRegex,
      (match, dpCell, i, j, value) => {
        if (j) {
          return `${match}; console.log('TRACE: ' + JSON.stringify({ event: 'update', i: ${i}, j: ${j}, value: ${value}, dpTable: dp }));`;
        } else {
          return `${match}; console.log('TRACE: ' + JSON.stringify({ event: 'update', i: ${i}, value: ${value}, dpArray: JSON.stringify(dp) }));`;
        }
      }
    );
    
    return instrumentedCode;
  }

  /**
   * Instrument backtracking code
   * @param {string} code - Original code
   * @returns {string} Instrumented code
   */
  static _instrumentBacktrackingCode(code) {
    // Add logging for recursive calls and backtracking
    const functionCallRegex = /(backtrack|solve|dfs)\s*\(([^)]+)\)/g;
    const instrumentedCode = code.replace(
      functionCallRegex,
      (match, funcName, params) => {
        return `console.log('TRACE: ' + JSON.stringify({ event: 'call', function: '${funcName}', params: [${params}] })); ${match}`;
      }
    );
    
    return instrumentedCode;
  }

  /**
   * Instrument graph algorithm code
   * @param {string} code - Original code
   * @returns {string} Instrumented code
   */
  static _instrumentGraphCode(code) {
    // Add logging for node visits and edge traversals
    const visitNodeRegex = /(visited\[([^\]]+)\])\s*=\s*true/g;
    const instrumentedCode = code.replace(
      visitNodeRegex,
      (match, visitedNode, node) => {
        return `${match}; console.log('TRACE: ' + JSON.stringify({ event: 'visit', node: ${node}, visited: visited }));`;
      }
    );
    
    return instrumentedCode;
  }

  /**
   * Generic code instrumentation
   * @param {string} code - Original code
   * @returns {string} Instrumented code
   */
  static _instrumentGenericCode(code) {
    // Add basic logging at function calls and variable assignments
    const functionCallRegex = /function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/g;
    let instrumentedCode = code.replace(
      functionCallRegex,
      (match, funcName, params) => {
        return `${match}\n  console.log(\`TRACE: ${JSON.stringify({ event: 'function_enter', name: '${funcName}', params: arguments })}\`);`;
      }
    );
    
    // Add logging for return statements
    const returnRegex = /return\s+([^;]+);/g;
    instrumentedCode = instrumentedCode.replace(
      returnRegex,
      (match, returnValue) => {
        return "console.log('TRACE: ' + JSON.stringify({ event: 'return', value: " + returnValue + " })); " + match;
      }
    );
    
    return instrumentedCode;
  }

  /**
   * Run visualized code using Judge0 API
   * @param {string} userCode - User submitted code
   * @param {number} languageId - Judge0 language ID
   * @param {string} problemId - Problem identifier
   * @returns {Promise<Object>} Execution result with visualization steps
   */
  static async runVisualizedCode(userCode, languageId, problemId) {
    try {
      // Instrument the code with visualization logging
      const instrumentedCode = this.instrumentCode(userCode, languageId, problemId);
      
      // Judge0 API configuration - using default API
      const judge0Url = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
      
      // Submit code to Judge0 using default API
      const submission = await axios.post(`${judge0Url}/submissions`, {
        source_code: instrumentedCode,
        language_id: languageId,
        stdin: '',
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const token = submission.data.token;
      
      // Poll for results
      let result;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const response = await axios.get(`${judge0Url}/submissions/${token}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.status.id > 2) { // Not in queue or processing
          result = response.data;
          break;
        }
        
        attempts++;
      }
      
      if (!result) {
        throw new Error('Execution timed out');
      }
      
      // Process the output
      const stdout = result.stdout || '';
      const stderr = result.stderr || '';
      
      // Extract visualization steps from stdout
      const visualizationSteps = [];
      let finalOutput = [];
      
      stdout.split('\n').forEach(line => {
        if (line.startsWith('TRACE:')) {
          try {
            const traceData = JSON.parse(line.substring(6).trim());
            visualizationSteps.push(traceData);
          } catch (e) {
            console.error('Error parsing trace data:', e);
          }
        } else {
          finalOutput.push(line);
        }
      });
      
      return {
        success: result.status.id === 3, // 3 = Accepted
        finalOutput: finalOutput.join('\n'),
        visualizationSteps,
        error: stderr || (result.status.id !== 3 ? result.status.description : null)
      };
    } catch (error) {
      console.error('Error running visualized code:', error);
      throw error;
    }
  }
}

module.exports = DSAService;