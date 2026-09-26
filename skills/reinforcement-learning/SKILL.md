---
name: reinforcement-learning
description: Understand and apply reinforcement learning — MDPs, value and policy methods, exploration, reward design, and RLHF basics. Use when decisions are sequential and feedback comes as rewards.
category: ai-research
---

# Reinforcement Learning

Reinforcement learning trains agents to make sequences of decisions by rewarding good outcomes. 
It's the framework behind game-playing breakthroughs, robotics control, and the human-feedback 
tuning of language models — powerful where feedback is sequential, tricky everywhere else.

## Overview

The setup: an agent observes states, takes actions, receives rewards, and learns a policy 
maximizing long-term return. The challenges are fundamental — credit assignment (which action 
deserved the reward?), exploration vs. exploitation, and sample efficiency. In practice, RL shines 
in simulators and games; in the real world, reward design and safety dominate. RLHF (learning from 
human preferences) brought RL to language models by replacing hand-designed rewards with learned 
preference models.

## When to use

- Sequential decision problems with a simulator: games, robotics sims, scheduling, routing.
- Tuning language models with human preferences (RLHF/RLAIF) or verifiable rewards (math, code).
- Control problems where the dynamics are complex but simulatable.
- Understanding RL papers, methods, and their limitations.

## Core concepts

- **MDP framing**: states, actions, rewards, transitions, discount factor. If you can't frame it as 
an MDP with a real reward signal, RL probably isn't the tool.
- **Value vs. policy methods**: value methods learn "how good is this situation" (Q-learning, DQN); 
policy methods learn "what should I do" directly (REINFORCE, PPO). Actor-critic combines both — 
the modern default.
- **Exploration**: epsilon-greedy, entropy bonuses, intrinsic curiosity. Without exploration the 
agent converges to the first mediocre strategy it finds.
- **Reward design**: the reward is the objective — misspecified rewards produce reward hacking 
(the agent games your metric). Design rewards carefully; prefer sparse true rewards over dense 
proxy rewards that invite gaming.
- **Sample efficiency**: RL is data-hungry. Simulators, offline RL from logged data, and 
model-based methods address this — each with trade-offs.
- **RLHF pipeline**: supervised fine-tune → train reward model on human preferences → optimize 
policy against it (PPO or DPO-style) with KL regularization to stay near the base model.

## Practical workflow

1. Frame the MDP honestly: is there a real reward signal, or are you inventing one? Invented 
rewards get hacked.
2. Start with the simplest baseline: random policy performance, then a heuristic — know what 
"good" looks like.
3. Build or find a fast simulator; RL needs orders of magnitude more samples than supervised 
learning.
4. Choose the algorithm family: PPO as the robust default for policy learning; value methods for 
discrete-action problems.
5. Tune exploration and watch for reward hacking — inspect what the agent actually learned, not 
just the reward curve.
6. Evaluate on held-out scenarios; test robustness to distribution shift before any real-world 
deployment.

```text
RL sanity checklist:
[ ] MDP framing with a genuine reward signal
[ ] Random + heuristic baselines established
[ ] Fast simulator available (sample efficiency!)
[ ] Reward checked for hackability
[ ] Learned behavior inspected, not just reward plotted
[ ] Evaluated on unseen scenarios
```

## Common pitfalls

- **Reward hacking**: the agent maximizes your metric while violating your intent. The classic RL 
failure — design rewards as the true objective.
- **No simulator, no RL**: trying RL on expensive real-world samples directly. Simulate first; 
real-world RL is a last resort.
- **Ignoring baselines**: elaborate RL that loses to a heuristic. Baselines first.
- **Sparse rewards without shaping**: the agent never stumbles on reward. Either shape carefully or 
use curiosity/exploration bonuses.
- **Unstable training**: RL is finicky — seeds, hyperparameters, and implementation details 
matter enormously. Multiple seeds, always.
- **Deploying uninspected policies**: a high-reward policy doing something alarming. Watch the 
behavior, not the curve.
