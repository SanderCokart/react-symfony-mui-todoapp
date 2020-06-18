<?php

namespace App\Controller;

use App\Entity\Tag;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

/**
 * @Route("/api/tag", name="api_tag")
 */
class TagController extends AbstractController
{

    private $tagRepository;
    private $manager;

    public function __construct(TagRepository $tagRepository, EntityManagerInterface $manager)
    {
        $this->tagRepository = $tagRepository;
        $this->manager       = $manager;
    }

    /**
     * @Route("/index", name="api_tag_index", methods={"GET"})
     */
    public function index()
    {
        $tags = $this->tagRepository->findAll();

        return $this->json($tags, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['tags']
        ]);
    }

    /**
     * @Route("/{id}", name="api_tag_show", methods={"GET"})
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id)
    {
        $tag = $this->tagRepository->findOneBy(['id' => $id]);

        return $this->json($tag ? $tag : ['message' => 'Tag does not exist.'], Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['tags']
        ]);

    }
}


