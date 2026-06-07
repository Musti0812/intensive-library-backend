import { PrismaClient } from "../generated/prisma/client";
import { validate } from "../schemas/category";
import express from "express";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/", async (req, res) => {
  const getCategories = await prisma.category.findMany();

  return res.send(getCategories);
});

router.get("/:id", async (req, res) => {
  const getSingleCategory = await prisma.category.findFirst({
    where: { id: req.params.id },
  });

  if (!getSingleCategory) return res.status(404).send("Category not found");

  return res.send(getSingleCategory);
});

router.post("/", async (req, res) => {
  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

    const createCategory = await prisma.category.create({
      data: {
        name: req.body.name,
      },
    });

    return res.status(201).send(createCategory);
});

router.put("/:id", async (req, res) => {
  const findCategory = await prisma.category.findFirst({
    where: { id: req.params.id },
  });

  if (!findCategory)
    return res.status(404).send("The category with the given ID was not found");

  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

    const updatedCategory = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
      },
    });

    return res.send(updatedCategory);
});

router.delete("/:id", async (req, res) => {
  const findCategory = await prisma.category.findFirst({
    where: { id: req.params.id },
  });

  if (!findCategory)
    return res.status(404).send("The category with the given ID was not found");

    const deletedCategory = await prisma.category.delete({
      where: { id: req.params.id },
    });

    return res.send(deletedCategory);
});

export default router;
