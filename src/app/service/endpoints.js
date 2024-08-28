const Endpoints = (instance) => ({
    ObterModelos: (Duvida) => instance.get(`modelo?frase=${Duvida}`),
});

export default Endpoints;
