<?php

namespace App\Controller;

use App\Controller\Services\Message;
use App\Entity\Tag;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @Route("/api/tag", name="api_tag")
 */
class TagController extends AbstractController
{
    /**
     * @var TagRepository
     */
    private $tagRepository;
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;
    /**
     * @var ValidatorInterface
     */
    private $validator;

    public function __construct(TagRepository $tagRepository, EntityManagerInterface $entityManager, ValidatorInterface $validator)
    {

        $this->tagRepository = $tagRepository;
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    /**
     * @Route("/read", name="api_tag_read", methods={"GET"})
     */
    public function read()
    {
        $oldTags = $this->tagRepository->findAll();
        $newTags = [];

        foreach ($oldTags as $tag) {
            $newTags[] = $tag->normalize();
        }
        return $this->json($newTags);
    }

    /**
     * @Route("/create", name="api_tag_create", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request)
    {
        $content = json_decode($request->getContent());

        $tag = new Tag();
        $tag->setName($content->name);

        $tagNameError = $this->validator->validateProperty($tag, 'name');

        $errors = [];
        if (sizeof($tagNameError) > 0) {
            $errors[] = $tagNameError[0]->getMessage();

            return $this->json(
                ['message' => ['text' => $errors, 'level' => 'error']]
            );
        }

        $this->entityManager->persist($tag);
        $this->entityManager->flush();

        return $this->json([
            'tag' => $tag->normalize(),
        ]);
    }

    /**
     * @Route("/delete/{id}", name="api_tag_delete", methods={"DELETE"})
     * @param Tag $tag
     * @return JsonResponse
     */
    public function delete(Tag $tag)
    {
        $this->entityManager->remove($tag);
        $this->entityManager->flush();

        $form = $this->createFormBuilder();

        return $this->json([]);
    }
}
