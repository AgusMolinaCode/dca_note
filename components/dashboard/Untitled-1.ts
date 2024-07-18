const ADD_VALUES_URL = `http://localhost:3000/api/values`;
  
  const postData = async () => {
    const valueData = {
      userId: user?.id,
      total: totalValue,
    };

    try {
      const response = await fetch(ADD_VALUES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(valueData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      postData();
    }, 1800000); // 60000 ms = 1 minuto

    return () => clearInterval(timer); 
  }, [postData]);