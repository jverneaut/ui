<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class ApiController extends AbstractController
{
    /**
     * @Route("/api", name="api", methods={"GET"})
     */
    public function index(Request $request): Response
    {
        $query = $request->query;
        $path = $query->get('path');
        $tpl = $query->get('tpl');

        if (empty($path) && empty($tpl)) {
            die('Nothing to display.');
        }

        if (!empty($tpl)) {
            return $this->render("@private/render-from-tpl.html.twig", $query->all());
        }

        return $this->render($query->get('path'), $query->all());
    }

    /**
     * @Route("/api/source", name="api-source", methods={"GET"})
     */
    public function source(Request $request): Response
    {
        $query = $request->query;
        $path = $query->get('path');

        if (empty($path)) {
            die('Nothing to display.');
        }

        $file_path =  __DIR__ . '/../../../ui/' . $path;

        if (!file_exists($file_path)) {
            die('No file found for "' . $path . '".');
        }

        return new Response(file_get_contents($file_path));
    }
}
