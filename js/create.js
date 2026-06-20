const CreateArquivo = (() => {

    function carregarArquivo(entidadeId) {
        const chave = `arquivo.${entidadeId}`;

        const arquivo = JSON.parse(localStorage.getItem(chave));

        if (arquivo) return arquivo;

        const novoArquivo = {
            ultimoId: 0,
            registros: []
        };

        localStorage.setItem(chave, JSON.stringify(novoArquivo));

        return novoArquivo;
    }

    function salvarArquivo(entidadeId, arquivo) {
        localStorage.setItem(
            `arquivo.${entidadeId}`,
            JSON.stringify(arquivo)
        );
    }

    function encontrarEspacoVazio(arquivo, tamanhoNovoRegistro) {

        for (let i = 0; i < arquivo.registros.length; i++) {

            const registro = arquivo.registros[i];

            if (
                registro.lapide === "*" &&
                registro.tamanho >= tamanhoNovoRegistro
            ) {
                return i;
            }
        }

        return -1;
    }

    function create(entidadeId, valores) {

        const arquivo = carregarArquivo(entidadeId);

        const id = arquivo.ultimoId + 1;
        arquivo.ultimoId = id;

        const bytes = ConversorDinamico.toByteArray(
            valores.map(v => ({
                nome: v.nome,
                tipo: v.tipo
            })),
            valores.map(v => v.valor)
        );

        const tamanho = bytes.length;

        const endereco = encontrarEspacoVazio(
            arquivo,
            tamanho
        );

        const novoRegistro = {
            lapide: " ",
            tamanho,
            id,
            bytes
        };

        if (endereco === -1) {

            arquivo.registros.push(novoRegistro);

        } else {

            arquivo.registros[endereco] = novoRegistro;

        }

        const entidade = EntidadeStorage.buscarPorId(entidadeId);

if (entidade) {

    const valoresObjeto = {};

    valores.forEach(campo => {
        valoresObjeto[campo.nome] = campo.valor;
    });

    entidade.registros.push({
        id,
        ativo: true,
        valores: valoresObjeto,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
    });

    EntidadeStorage.salvar(entidade);
}

        salvarArquivo(entidadeId, arquivo);

        return id;
    }

    return {
        create,
        carregarArquivo
    };

})();