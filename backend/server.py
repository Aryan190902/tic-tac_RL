from flask import Flask, jsonify, request
import pickle
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

with open('ticTacToe_qTable.pkl', 'rb') as f:
    qTable = pickle.load(f)

class QLearningAgent:
    def __init__(self, qTable):
        self.qTable = qTable

    def getQvalue(self, state, action):
        return self.qTable.get((state, action), 0.0)
    
    def chooseAction(self, state, availableMoves):
        qValues = [self.getQvalue(state, a) for a in availableMoves]
        maxQ = max(qValues)
        return availableMoves[qValues.index(maxQ)]
    
agent = QLearningAgent(qTable)

@app.route('/api/make-move', methods=['POST'])
def makeMove():
    data = request.json
    state = tuple(data['state'])
    availableMoves = data['available_moves']

    action = agent.chooseAction(state, availableMoves)
    return jsonify({'action': action})

if __name__ == '__main__':
    app.run(debug=True)