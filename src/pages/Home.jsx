import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F8D3]">
      <h2 className="text-3xl font-bold text-[#73C7C7]">Welcome to Our Platform</h2>
      <p className="mt-2 text-gray-700">Choose an option to get started:</p>

      <div className="mt-6 space-y-4">
        <Link
          to="/login"
          className="block w-60 text-center bg-[#73C7C7] text-white py-2 rounded-lg hover:bg-[#A6F1E0] transition"
        >
          Login
        </Link>
        <Link
          to="/signup/student"
          className="block w-60 text-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-400 transition"
        >
          Sign Up as Student
        </Link>
        <Link
          to="/signup/counsellor"
          className="block w-60 text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400 transition"
        >
          Sign Up as Counsellor
        </Link>
      </div>
    </div>
  );
};

export default Home;
