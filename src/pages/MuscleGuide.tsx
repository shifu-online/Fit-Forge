import MuscleCard from "../components/MuscleCard";


const muscleGroups = [
  {
    name: "Chest",
    location: "Front upper body",
    function: "Pushing movements",
    exercise: "Bench Press",
    sub: [
      { name: "Pectoralis Major", desc: "Main chest muscle for pushing." },
      { name: "Pectoralis Minor", desc: "Assists in shoulder movement." }
    ]
  },
  {
    name: "Back",
    location: "Rear upper body",
    function: "Pulling movements and posture",
    exercise: "Pull-ups",
    sub: [
      { name: "Latissimus Dorsi", desc: "Large back muscle for pull strength." },
      { name: "Trapezius", desc: "Stabilizes shoulder blades." }
    ]
  },
  {
    name: "Legs",
    location: "Lower body",
    function: "Movement and support",
    exercise: "Squats",
    sub: [
      { name: "Quadriceps", desc: "Front thigh muscles for knee extension." },
      { name: "Hamstrings", desc: "Back thigh muscles for knee flexion." },
      { name: "Calves", desc: "Lower leg muscles for ankle movement." }
    ]
  }
];

export default function MuscleGuide() {
  return (
    <div className="section active">
      <div className="section-header">
        <div>
          <h1>Muscle Guide 🧠</h1>
          <p>Learn about key muscle groups and how to train them</p>
        </div>
      </div>

      <div className="plans-grid">
        {muscleGroups.map((group, index) => (
          <MuscleCard key={index} group={group} />
        ))}
      </div>
    </div>
  );
}
