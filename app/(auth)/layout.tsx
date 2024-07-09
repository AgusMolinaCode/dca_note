const Layout = ({ children } : { children: React.ReactNode }) => {
    return (
      <div className="flex-center  w-full bg-primary-50">
        {children}
      </div>
    );
  }
  
  export default Layout;