import { Request, Response } from "express";
import TResumo from "../../tipos/TResumo";
import {
  buscarMaterias_id,
  fazerResumo,
} from "../../repositories/user-repository";
import { pegarIdToken } from "../../auxiliares/token.auxilar";

export const criarUmResumo = async (req: Request, res: Response) => {
  const { materiaId, titulo, topicos } = req.body;
  const { authorization } = req.headers;
  try {
    const token = String(authorization).split(" ")[1];
    const id = pegarIdToken(token);

    const descricaoProvisoria = "Gemini";
    const tituloCompleto = titulo ?? "Sem título";
    const topicosRefatorado = topicos.join(", ");

    const resumoCriado: TResumo = {
      usuarioId: id,
      materiaId: materiaId,
      titulo: tituloCompleto,
      topicos: topicosRefatorado,
      descricao: descricaoProvisoria,
    };

    const { rows: resumo } = await fazerResumo(resumoCriado);

    const resumoRows = resumo[0];

    const resumoRetornado = {
      id: resumoRows.id,
      usuarioId: resumoRows.usuario_id,
      materiaId: resumoRows.materia_id,
      titulo: resumoRows.titulo,
      topicos: resumoRows.topicos.split(", "),
      descricao: resumoRows.descricao,
      criado: resumoRows.criado,
    };

    return res.status(201).json(resumoRetornado);
  } catch (error) {
    return res.status(500).json({ mensagen: "Erro interno" });
  }
};
