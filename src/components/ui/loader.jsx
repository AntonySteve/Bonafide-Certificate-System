// src/components/ui/loader.jsx
export function Loader() {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  
  export default Loader;  