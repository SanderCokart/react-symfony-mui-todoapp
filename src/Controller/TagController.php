<?php

namespace App\Controller;

use App\Entity\Tag;
use App\Repository\TagRepository;
use App\Service\CustomValidator;
use Doctrine\ORM\EntityManagerInterface;
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

    public function __construct(TagRepository $tagRepository, EntityManagerInterface $entityManager, CustomValidator $validator)
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
     */
    public function create(Request $request)
    {
        $content = json_decode($request->getContent());

        $tag = new Tag();
        $tag->setName($content->name);

        $errors = $this->validator->validate($tag);

        if (sizeof($errors) > 0) {
            return $this->json([
                    'alert' => ['text' => $errors, 'level' => 'warning']
                ]
            );
        } else {
            $this->entityManager->persist($tag);
            $this->entityManager->flush();

            return $this->json([
                'tag' => $tag->normalize(),
                'alert' => ['text' => 'Tag has been created!', 'level' => 'success']
            ]);
        }
    }

    /**
     * @Route("/update/{id}", name="api_tag_update", methods={"PUT"})
     * @param Request $request
     * @param Tag $tag
     * @return JsonResponse
     */
    public
    function update(Request $request, Tag $tag)
    {
        $content = json_decode($request->getContent());
        $tag->setName($content->name);

        $errors = $this->validator->validate($tag);

        if (sizeof($errors) > 0) {
            return $this->json(
                ['alert' => ['text' => $errors, 'level' => 'error']]
            );
        } else {
            $this->entityManager->flush();
            return $this->json(
                ['alert' => ['text' => 'Tag has been updated!', 'level' => 'success']]
            );
        }
    }

    /**
     * @Route("/delete/{id}", name="api_tag_delete", methods={"DELETE"})
     * @param Tag $tag
     * @return JsonResponse
     */
    public
    function delete(Tag $tag)
    {
        $errors = $this->validator->validate($tag);
        if (sizeof($errors) > 0) {
            return $this->json([
                ['alert' => ['text' => $errors, 'level' => 'error']]
            ]);
        }

        $this->entityManager->remove($tag);
        $this->entityManager->flush();

        return $this->json(
            ['alert' => ['text' => 'Tag has been deleted!', 'level' => 'success']]
        );
    }
}
