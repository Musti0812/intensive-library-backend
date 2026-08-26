import { validate, validateCheckout } from "../schemas/libraryItem";
import { PrismaClient } from "../generated/prisma/client";
import express from "express";

const prisma = new PrismaClient();

const router = express.Router();

const LOAN_PERIOD_DAYS = 14;

router.get("/types", async (req, res) => {
  const getTypes = await prisma.libraryItemType.findMany();

  return res.send(getTypes);
});

router.get("/", async (req, res) => {
  const getLibraryItems = await prisma.libraryItem.findMany({
    include: {
      category: true,
      libraryItemType: true,
    },
  });

  return res.send(getLibraryItems);
});

router.get("/:id", async (req, res) => {
  const findLibraryItem = await prisma.libraryItem.findFirst({
    where: { id: req.params.id },
    include: {
      category: true,
      libraryItemType: true,
    },
  });

  if (!findLibraryItem)
    return res.status(404).send("The library item with the given ID was not found");

  return res.send(findLibraryItem);
});

router.post("/", async (req, res) => {
  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const getCategory = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });

  if (!getCategory)
    return res.status(404).send("The category with the given ID was not found");

  const getType = await prisma.libraryItemType.findFirst({
    where: { id: req.body.libraryItemTypeId },
  });

  if (!getType)
    return res.status(404).send("The library item type with the given ID was not found");

  const createLibraryItem = await prisma.libraryItem.create({
    data: {
      title: req.body.title,
      acronym: req.body.acronym,
      libraryItemTypeId: req.body.libraryItemTypeId,
      categoryId: req.body.categoryId,
      isBorrowable: req.body.isBorrowable,
      author: req.body.author,
      nbrPages: req.body.nbrPages,
      runTimeMinutes: req.body.runTimeMinutes,
    },
    include: {
      category: true,
      libraryItemType: true,
    },
  });

  return res.status(201).send(createLibraryItem);
});

router.put("/:id", async (req, res) => {
  const findLibraryItem = await prisma.libraryItem.findFirst({
    where: { id: req.params.id },
    include: {
      category: true,
      libraryItemType: true,
    },
  });

  if (!findLibraryItem)
    return res.status(404).send("The library item with the given ID was not found");

  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const getCategory = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });

  if (!getCategory)
    return res.status(404).send("The category with the given ID was not found");

  const getType = await prisma.libraryItemType.findFirst({
    where: { id: req.body.libraryItemTypeId },
  });

  if (!getType)
    return res.status(404).send("The library item type with the given ID was not found");

  const updatedLibraryItem = await prisma.libraryItem.update({
    where: { id: req.params.id },
    data: {
      title: req.body.title,
      acronym: req.body.acronym,
      libraryItemTypeId: req.body.libraryItemTypeId,
      categoryId: req.body.categoryId,
      isBorrowable: req.body.isBorrowable,
      author: req.body.author,
      nbrPages: req.body.nbrPages,
      runTimeMinutes: req.body.runTimeMinutes,
    },
    include: {
      category: true,
      libraryItemType: true,
    },
  });

  return res.send(updatedLibraryItem);
});

router.delete("/:id", async (req, res) => {
  const findLibraryItem = await prisma.libraryItem.findFirst({
    where: { id: req.params.id },
  });

  if (!findLibraryItem)
    return res.status(404).send("The library item with the given ID was not found");

  const deletedLibraryItem = await prisma.libraryItem.delete({
    where: { id: req.params.id },
  });

  return res.send(deletedLibraryItem);
});

router.post("/:id/checkout", async (req, res) => {
  const borrowDate = new Date();
  // checkout timestamp + 1,209,600,000 milliseconds
  const dueDate = new Date(
    borrowDate.getTime() + LOAN_PERIOD_DAYS * 24 * 60 * 60 * 1000,
  );

  const validation = validateCheckout({
    borrower: req.body.borrower,
    dueDate,
  });

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const findLibraryItem = await prisma.libraryItem.findFirst({
    where: { id: req.params.id },
    include: {
      category: true,
      libraryItemType: true,
    },
  });

  if (!findLibraryItem)
    return res.status(404).send("The library item with the given ID was not found");

  if (findLibraryItem.libraryItemType.name.toLowerCase() === "reference book")
    return res.status(400).send("A reference book cannot be borrowed");

  if (!findLibraryItem.isBorrowable)
    return res.status(400).send("This library item is not borrowable");

  if (
    findLibraryItem.borrower ||
    findLibraryItem.borrowDate ||
    findLibraryItem.dueDate
  )
    return res.status(400).send("This library item is already checked out");

  const checkedOutLibraryItem = await prisma.libraryItem.update({
    where: { id: req.params.id },
    data: {
      borrower: validation.data.borrower,
      borrowDate,
      dueDate: validation.data.dueDate,
    },
    include: {
      category: true,
      libraryItemType: true,
    },
  });

  return res.send(checkedOutLibraryItem);
});

router.post("/:id/checkin", async (req, res) => {
  const findLibraryItem = await prisma.libraryItem.findFirst({
    where: { id: req.params.id },
  });

  if (!findLibraryItem)
    return res.status(404).send("The library item with the given ID was not found");

  const checkedInLibraryItem = await prisma.libraryItem.update({
    where: { id: req.params.id },
    data: {
      borrower: null,
      borrowDate: null,
      dueDate: null,
    },
    include: {
      category: true,
      libraryItemType: true,
    },
  });

  return res.send(checkedInLibraryItem);
});

export default router;
